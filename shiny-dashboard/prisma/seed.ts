import path from "path";
import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { SEED_JOBS } from "../lib/seed-data.js";

const dbPath = path.join(process.cwd(), "prisma/dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.job.deleteMany();
  for (const job of SEED_JOBS) {
    await prisma.job.create({ data: job });
  }
  console.log(`Seeded ${SEED_JOBS.length} jobs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
