import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('STRIPE') private readonly stripe: Stripe,
    private readonly prismaService: PrismaService
  ) {}

  public async constructEventFromPayload(
    signature: string,
    payload: Buffer
  ): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    return await this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
  }

  public async isDublicate(
    eventStripeId: string,
    type: string
  ): Promise<boolean> {
    const isSelected = await this.prismaService.events.findFirst({
      where: {
        id: eventStripeId
      }
    });

    if (isSelected) {
      return true;
    }

    await this.prismaService.events.create({
      data: {
        eventStripeId,
        type
      }
    });

    return false;
  }
}
