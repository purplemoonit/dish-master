/*
  Warnings:

  - Added the required column `category` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Ingredient_name_key";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;
