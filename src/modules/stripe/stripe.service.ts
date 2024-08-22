import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('STRIPE') private readonly stripe: Stripe
  ) {}

  public getPublicKey(): string {
    return this.configService.get('STRIPE_PUBLIC_KEY');
  }

  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
  }
}
