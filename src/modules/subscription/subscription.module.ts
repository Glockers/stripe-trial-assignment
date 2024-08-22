import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { StripeProvider } from 'src/shared/stripe.provider';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, StripeProvider],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
