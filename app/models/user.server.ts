import { db } from "~/services/db.server";
import { hashPassword, verifyPassword } from "~/services/auth.server";

export type UserSignupData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export async function createUser(data: UserSignupData) {
    const passwordHash = await hashPassword(data.password);
    return db.user.create({
        data: {
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
        },
    });
}

export async function verifyLogin(email: string, password: string) {
    const user = await db.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            passwordHash: true,
            firstName: true,
            lastName: true,
            phone: true
        }
    });

    if (!user) return null;
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}