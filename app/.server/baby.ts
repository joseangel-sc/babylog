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

export async function inviteNewParent(babyId: number, email: string, senderId: number) {
    return db.parentInvite.create({
      data: {
        email,
        babyId,
        senderId,
        status: "PENDING",
        // Other fields will be filled with defaults from the schema
      },
    });
  }
  // This function handles the creation of a new baby and optionally populates 'parentInvite'
export async function handleBabyCreation(request: Request) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
  
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const gender = formData.get("gender") as string;
  
    // Get the optional parent invite email if it exists
    const inviteParent = formData.get("inviteParent") === "true";
    const parentEmail = formData.get("parentEmail") as string || null;
    
    if (!firstName || !lastName || !dateOfBirth) {
    return { error: "All fields are required" };
}

    // If inviting parent is selected but no email is provided
    if (inviteParent && !parentEmail) {
    return { error: "Parent email is required" };
}

const baby = await createBaby(userId, {
  firstName,
  lastName,
  dateOfBirth: new Date(dateOfBirth),
  gender: gender || null,
});

    // If parent invitation was requested, create the invitation
    if (inviteParent && parentEmail) {
    await inviteNewParent(baby.id, parentEmail, userId);
}

return { baby };
}
