import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships a small WASM/runtime layer. Next.js needs the package
  // transpiled so local embedded Postgres works in the Node server bundle.
  transpilePackages: ["@electric-sql/pglite"],
};

export default nextConfig;
