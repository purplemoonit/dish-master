/*
  Warnings:

  - You are about to drop the `RecipeRegion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecipeRegion" DROP CONSTRAINT "RecipeRegion_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeRegion" DROP CONSTRAINT "RecipeRegion_regionId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "countryId" TEXT,
ALTER COLUMN "origin" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "RecipeRegion";

-- DropTable
DROP TABLE "Region";

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flagImage" TEXT,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
