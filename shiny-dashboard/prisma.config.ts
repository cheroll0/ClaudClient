import { defineConfig } from "prisma/config";
import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const dbPath = path.join(process.cwd(), "prisma/dev.db");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasource: {
    url: `file:${dbPath}`,
    adapter: new PrismaBetterSqlite3({ url: dbPath }),
  } as any,
});
