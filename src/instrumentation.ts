import { ensureDatabaseReady } from "@/db";

export async function register() {
  // Arena owns its local persistence by default. This runs before requests
  // are handled, so API routes never need a manual database setup step.
  await ensureDatabaseReady();
}
