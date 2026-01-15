/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isSubscribed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture_public_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resume` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resume_public_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_userId_fkey";

-- DropIndex
DROP INDEX "User_createdAt_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "isSubscribed",
DROP COLUMN "name",
DROP COLUMN "phone_number",
DROP COLUMN "profile_picture",
DROP COLUMN "profile_picture_public_id",
DROP COLUMN "resume",
DROP COLUMN "resume_public_id",
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "UserSkill";

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
