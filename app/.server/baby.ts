import { db } from "./db";
import type { Baby } from "@prisma/client";

interface AdditionalParent {
  firstName: string;
  lastName: string;
  email: string;
}

export async function createBaby(
    ownerId: number,
    data: Pick<Baby, "firstName" | "lastName" | "dateOfBirth" | "gender"> & {
        additionalParent?: AdditionalParent;
    }
) {
    const { additionalParent, ...babyData } = data;
    console.log("Creating baby with data:", { babyData, additionalParent }); // Debug log

    return db.$transaction(async (tx) => {
        // Create baby with initial owner as caregiver
        const baby = await tx.baby.create({
            data: {
                ...babyData,
                ownerId,
                caregivers: {
                    create: {
                        userId: ownerId,
                        relationship: "PARENT",
                        permissions: ["all"],
                    },
                },
            },
            include: {
                caregivers: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        if (additionalParent) {
            console.log("Adding additional parent:", additionalParent); // Debug log
            
            // Check if user already exists
            let user = await tx.user.findUnique({
                where: { email: additionalParent.email.toLowerCase() },
            });

            if (!user) {
                // Create new user if they don't exist
                user = await tx.user.create({
                    data: {
                        ...additionalParent,
                        email: additionalParent.email.toLowerCase(),
                        passwordHash: "", // We'll handle password setup later
                    },
                });
            }

            // Add as caregiver if not already one
            const existingCaregiver = await tx.babyCaregiver.findFirst({
                where: {
                    babyId: baby.id,
                    userId: user.id,
                },
            });

            if (!existingCaregiver) {
                await tx.babyCaregiver.create({
                    data: {
                        babyId: baby.id,
                        userId: user.id,
                        relationship: "PARENT",
                        permissions: ["all"],
                    },
                });
            }
        }

        return baby;
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
