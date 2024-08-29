-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_customerId_fkey";

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
