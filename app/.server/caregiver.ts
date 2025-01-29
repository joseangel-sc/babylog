import { db } from "./db";

export async function addCaregiver(
  babyId: number,
  userId: number,
  relationship: string,
  permissions: string[] = ["view", "log"]
) {
  return db.babyCaregiver.create({
    data: {
      babyId,
      userId,
      relationship,
      permissions,
    },
  });
}

export async function removeCaregiver(babyId: number, userId: number) {
  return db.babyCaregiver.delete({
    where: {
      babyId_userId: {
        babyId,
        userId,
      },
    },
  });
}