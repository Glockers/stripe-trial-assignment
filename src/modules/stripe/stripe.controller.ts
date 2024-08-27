import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Headers,
  InternalServerErrorException
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { RequestWithRawBody } from 'src/shared/middlewares/rawBody.middleware';
import { CustomerService } from '../customer/customer.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly subscriptionService: SubscriptionService,
    private readonly customerService: CustomerService,
    @InjectPinoLogger(StripeController.name) private readonly logger: PinoLogger
  ) {}

  @Post('/webhook')
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody
  ) {
    if (!signature) {
      this.logger.error('Missing stripe-signature header');
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody
    );

    const isDuplicate = await this.stripeService.isDublicate(
      event.id,
      event.type
    );

    if (isDuplicate) {
      this.logger.error(`Duplicate event: ${event.type}`);
      throw new InternalServerErrorException(`Duplicate event: ${event.type}`);
    }

    this.logger.info(`Event: ${event.type}`);

    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        const product = invoice.lines.data[0];
        if (invoice['billing_reason'] === 'subscription_create') {
          await this.subscriptionService.updateDefaultPaymentMethod({
            payment_intent_id: invoice.payment_intent as string,
            subscription_id: invoice.subscription as string
          });

          return await this.subscriptionService.save({
            id: invoice.subscription as string,
            period: product.period,
            customerId: invoice.customer as string,
            priceId: product.price.id
          });
        } else if (invoice['billing_reason'] === 'subscription_cycle') {
          return await this.subscriptionService.extend({
            id: invoice.subscription as string,
            period: product.period
          });
        }
      case 'customer.deleted':
        const customer = event.data.object;
        return await this.customerService.deleteByStripeId(customer.id);
      default:
        this.logger.warn(`Webhook Error: Unhandled event type ${event.type}`);
        break;
    }
  }
}
