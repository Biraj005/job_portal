/*
  Warnings:

  - Changed the type of `logo_public_id` on the `Companies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recurter_id` on the `Companies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recuiter_id` on the `Jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Companies" DROP COLUMN "logo_public_id",
ADD COLUMN     "logo_public_id" INTEGER NOT NULL,
DROP COLUMN "recurter_id",
ADD COLUMN     "recurter_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "recuiter_id",
ADD COLUMN     "recuiter_id" INTEGER NOT NULL;
