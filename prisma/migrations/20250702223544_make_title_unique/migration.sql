/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Region` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Region_title_key" ON "Region"("title");
