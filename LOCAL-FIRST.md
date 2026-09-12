# Arena OS is local-first

Arena runs without a separate PostgreSQL installation.

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

With no `DATABASE_URL`, Arena automatically creates and persists an embedded PostgreSQL database in `.arena-data/` using PGlite. The schema is bootstrapped on server startup.

To use hosted PostgreSQL instead, set:

`DATABASE_URL=postgresql://...`

Arena will then use the hosted database and skip the embedded bootstrap.
