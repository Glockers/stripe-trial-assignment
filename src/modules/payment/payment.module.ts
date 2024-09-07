import { Module } from '@nestjs/common';
import { StripeController } from './stripe/stripe.controller';
import { SubscriptionModule } from 'src/modules/subscription/subscription.module';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { StripeModule } from './stripe/stripe.module';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [StripeModule, SubscriptionModule, CustomerModule],
  providers: [StripeService],
  controllers: [StripeController]
})
export class PaymentModule {}
