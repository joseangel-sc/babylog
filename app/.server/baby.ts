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
            caregivers: {
                create: {
                    userId: ownerId,
                    relationship: "PARENT"
                }
            }
        },
        include: {
            caregivers: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });
}

export async function getBaby(id: number, options: Partial<Parameters<typeof db.baby.findUnique>[0]> = {}) {
    return db.baby.findUnique({
        where: { id },
        ...options,
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

//export async fucntion addBabyOwner ->  Add another baby owner 
