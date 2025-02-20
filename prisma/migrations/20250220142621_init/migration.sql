/*
  Warnings:

  - You are about to drop the column `propietarioId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `resident` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `UserCoordinates` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_coordinatesId_fkey";

-- DropForeignKey
ALTER TABLE "UserCoordinates" DROP CONSTRAINT "UserCoordinates_coordinatesId_fkey";

-- DropForeignKey
ALTER TABLE "UserCoordinates" DROP CONSTRAINT "UserCoordinates_userId_fkey";

-- AlterTable
ALTER TABLE "Coordinates" ADD COLUMN     "supervisor" TEXT,
ALTER COLUMN "propietario_id" DROP NOT NULL,
ALTER COLUMN "resident" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "propietarioId",
DROP COLUMN "resident";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL;

-- DropTable
DROP TABLE "UserCoordinates";
