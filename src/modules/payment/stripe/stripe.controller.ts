import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Headers
} from '@nestjs/common';
import { RequestWithRawBody } from 'src/shared/middlewares/rawBody.middleware';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { StripePaymentayment } from './stripe-payment.service';
import { SubscriptionService } from 'src/modules/subscription/subscription.service';
import { CustomerService } from 'src/modules/customer/customer.service';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly stripePayment: StripePaymentayment,
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
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

    const event = await this.stripePayment.constructEventFromPayload(
      signature,
      request.rawBody
    );

    await this.stripeService.checkDublicateEvents(event.id, event.type);

    this.logger.info(`Event: ${event.type}`);

    switch (event.type) {
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        const product = invoice.lines.data[0];
        if (invoice['billing_reason'] === 'subscription_create') {
          const data = {
            paymentDetails: {
              paymentIntentId: invoice.payment_intent as string,
              subscriptionId: invoice.subscription as string
            },
            subscriptionDetails: {
              id: invoice.subscription as string,
              period: product.period,
              customerId: invoice.customer as string,
              priceId: product.price!.id
            }
          };
          await this.subscriptionService.subscriptionSave(data);
        } else if (invoice['billing_reason'] === 'subscription_cycle') {
          const data = {
            id: invoice.subscription as string,
            period: product.period
          };
          await this.subscriptionService.subscriptionExtend(data);
        }
        break;
      case 'customer.deleted':
        await this.customerService.deleteCustomer(event.data.object.id);
        break;
      case 'customer.subscription.deleted':
        const { id } = event.data.object;
        await this.subscriptionService.cancelSubscription(id);
        break;
      default:
        this.logger.warn(`Webhook Error: Unhandled event type ${event.type}`);
        break;
    }
  }
}
