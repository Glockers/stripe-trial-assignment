import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { StripeProvider } from 'src/shared/providers/stripe.provider';
import { SubscriptionModule } from '../subscription/subscription.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [SubscriptionModule, CustomerModule],
  controllers: [StripeController],
  providers: [StripeService, StripeProvider],
  exports: [StripeService]
})
export class StripeModule {}
