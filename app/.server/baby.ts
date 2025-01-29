import { db } from "./db";
import type { Baby } from "@prisma/client";

export async function createBaby(
    ownerId: number,
    data: Pick<Baby, "firstName" | "lastName" | "dateOfBirth" | "gender">
) {
    return db.baby.create({
        data: {
            ...data,
            ownerId,
        },
    });
}

export async function getBaby(id: number) {
    return db.baby.findUnique({
        where: { id },
        include: {
            owner: true,
            caregivers: {
                include: {
                    user: true,
                },
            },
        },
    });
}

export async function getUserBabies(userId: number) {
    return db.baby.findMany({
        where: {
            OR: [
                { ownerId: userId },
                {
                    caregivers: {
                        some: {
                            userId,
                        },
                    },
                },
            ],
        },
        orderBy: { dateOfBirth: "desc" },
    });
}