import { Module } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { StripeModule } from '../payment/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionRepository, SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
