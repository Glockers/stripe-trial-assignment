import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { StripeProvider } from 'src/shared/stripe.provider';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  controllers: [StripeController],
  providers: [StripeService, StripeProvider],
  exports: [StripeService]
})
export class StripeModule {}
