import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePgLite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ARENA_BOOTSTRAP_SQL } from "./bootstrap";

const globalForDb = globalThis as typeof globalThis & {
  __arenaPGlite?: PGlite;
  __arenaPostgresPool?: Pool;
  __arenaDatabaseReady?: Promise<void>;
};

const useHostedPostgres = Boolean(process.env.DATABASE_URL);

export const storageMode = useHostedPostgres ? "postgres" : "embedded";

let client: PGlite | undefined;
let pool: Pool | undefined;

if (useHostedPostgres) {
  pool =
    globalForDb.__arenaPostgresPool ??
    new Pool({ connectionString: process.env.DATABASE_URL });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaPostgresPool = pool;
  }
} else {
  const dataDir = process.env.ARENA_DATA_DIR
    ? path.resolve(process.env.ARENA_DATA_DIR)
    : path.resolve(process.cwd(), ".arena-data");

  client = globalForDb.__arenaPGlite ?? new PGlite(dataDir);
  globalForDb.__arenaPGlite = client;
}

export const db = (useHostedPostgres
  ? drizzlePostgres(pool!)
  : drizzlePgLite({ client: client! })) as any;

/**
 * Create the complete local schema automatically on first server start.
 * Hosted Postgres remains compatible with normal migrations and is not
 * modified by this function.
 */
export async function ensureDatabaseReady() {
  if (useHostedPostgres) return;

  if (!globalForDb.__arenaDatabaseReady) {
    const localClient = client!;
    globalForDb.__arenaDatabaseReady = localClient.exec(ARENA_BOOTSTRAP_SQL).then(() => undefined);
  }

  await globalForDb.__arenaDatabaseReady;
}
