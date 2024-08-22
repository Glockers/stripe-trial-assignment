import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { stripeConfig } from 'src/constants/config';

export const StripeProvider = {
  provide: 'STRIPE',
  useFactory: (configService: ConfigService) => {
    return new Stripe(configService.get('STRIPE_SECRET_KEY'), stripeConfig);
  },
  inject: [ConfigService]
};
