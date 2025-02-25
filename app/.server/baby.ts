import { db } from "./db";
import type { Baby } from "@prisma/client";
import { requireUserId } from "./session";

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

export async function addBabyOwner(babyId: number, userId: number) {
    return db.baby.update({
        where: { id: babyId },
        data: { ownerId: userId },
    });
}

export async function handleBabyCreation(request: Request) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
  
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const gender = formData.get("gender") as string;
  
    if (!firstName || !lastName || !dateOfBirth) {
      return { error: "All fields are required" };
    }
  
    const baby = await createBaby(userId, {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      gender: gender || null,
    });
  
    return { baby };
  }
//export async fucntion addBabyOwner ->  Add another baby owner 
