import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { plan_lookup_keys } from 'src/constants/config';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  constructor(@Inject('STRIPE') private readonly stripe: Stripe) {}

  public async create({ customerId, priceId }: any) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId
          }
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const intent = invoice.payment_intent as Stripe.PaymentIntent;

      return {
        status: HttpStatus.CREATED,
        subscriptionId: subscription.id,
        clientSecret: intent.client_secret
      };
    } catch (error) {
      console.error(error.message);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      };
    }
  }

  async getPlans() {
    return await this.stripe.prices.list({
      lookup_keys: [...plan_lookup_keys],
      expand: ['data.product']
    });
  }

  public async updateDefaultPaymentMethod({
    payment_intent_id,
    subscription_id
  }: any) {
    const payment_intent =
      await this.stripe.paymentIntents.retrieve(payment_intent_id);
    const paymentMethodId =
      typeof payment_intent.payment_method === 'string'
        ? payment_intent.payment_method
        : payment_intent.payment_method.id;

    try {
      const subscription = await this.stripe.subscriptions.update(
        subscription_id,
        {
          default_payment_method: paymentMethodId
        }
      );

      console.log(
        'Default payment method set for subscription:' +
          payment_intent.payment_method
      );

      return subscription;
    } catch (err) {
      console.error(err);
      console.error(
        `⚠️  Failed to update the default payment method for subscription: ${subscription_id}`
      );
    }
  }

  public async save() {}

  public async extend() {}
}
