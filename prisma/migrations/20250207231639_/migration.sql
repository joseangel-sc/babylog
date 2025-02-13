/*
  Warnings:

  - You are about to drop the column `location` on the `Sleep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sleep" DROP COLUMN "location",
ADD COLUMN     "how" TEXT,
ADD COLUMN     "whereFellAsleep" TEXT,
ADD COLUMN     "whereSlept" TEXT;
