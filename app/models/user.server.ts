import type { User } from "@prisma/client";
import { db } from "~/services/db.server";
import { hashPassword, verifyPassword } from "~/services/auth.server";

export async function createUser(email: string, password: string, name?: string) {
    const passwordHash = await hashPassword(password);
    return db.user.create({
        data: {
            email,
            passwordHash,
            name,
        },
    });
}

export async function verifyLogin(email: string, password: string) {
    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user) return null;
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    return user;
}
