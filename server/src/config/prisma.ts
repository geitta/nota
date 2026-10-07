import { PrismaClient } from "@prisma/client";

// A single shared instance — Prisma manages its own connection pool,
// creating a new client per request would exhaust Postgres connections.
export const prisma = new PrismaClient();
