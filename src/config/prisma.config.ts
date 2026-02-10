import pg from "pg";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
if (!process.env.DATABASE_URL) {
  throw new Error("Database Url enviroment variable is not set");
}

// connection postgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
//prisma adapter
const adapter = new PrismaPg(pool);

//create and export prismaClient with adapter
export const prisma = new PrismaClient({ adapter });

//gracefull shutdown handler

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
  await pool.end();
};
