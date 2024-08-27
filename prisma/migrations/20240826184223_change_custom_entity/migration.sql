/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Customer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Customer_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "stripeCustomerId";
