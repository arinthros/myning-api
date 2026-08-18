import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";

const url = process.env.DB_URL;
if (!url) throw new Error("DB_URL is not set");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaMariaDb(url) });

if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;

export default prisma;
