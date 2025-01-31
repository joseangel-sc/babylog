import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
    // eslint-disable-next-line no-var
    var __db__: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
    db = new PrismaClient();
} else {
    if (!global.__db__) {
        global.__db__ = new PrismaClient();
    }
    db = global.__db__;
    db.$connect();
}

export { db };
