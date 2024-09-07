import { Module } from '@nestjs/common';
import { StripePaymentayment } from './stripe-payment.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { stripeConfig } from 'src/config';

@Module({
  providers: [
    StripePaymentayment,
    {
      provide: 'STRIPE',
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get('STRIPE_SECRET_KEY'), stripeConfig);
      },
      inject: [ConfigService]
    }
  ],
  exports: [StripePaymentayment]
})
export class StripeModule {}
