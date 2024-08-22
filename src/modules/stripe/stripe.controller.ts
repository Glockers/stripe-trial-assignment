import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Headers,
  Get
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { RequestWithRawBody } from 'src/shared/rawBody.middleware';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Get('/getPublicKey')
  async getPublicKey() {
    return {
      publishableKey: this.stripeService.getPublicKey()
    };
  }

  @Post('/webhook')
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody
    );

    const dataObject = event.data.object;

    switch (event.type) {
      case 'invoice.payment_succeeded':
        if (dataObject['billing_reason'] == 'subscription_create') {
          const subscription_id = dataObject['subscription'];
          const payment_intent_id = dataObject['payment_intent'];
          this.subscriptionService.updateDefaultPaymentMethod({
            payment_intent_id,
            subscription_id
          });
        }
        break;
      default:
        return new BadRequestException(
          `Webhook Error: Unhandled event type ${event.type}`
        );
    }
  }
}
