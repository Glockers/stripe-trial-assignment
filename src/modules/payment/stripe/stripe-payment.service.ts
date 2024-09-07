import Stripe from 'stripe';
import {
  InvoiceData,
  InvoiceResult,
  PaymentMethodUpdateData,
  Payment,
  Price
} from '../entity/payment';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { getEndOfDayTimestamp } from 'src/shared/utils/date';
import { Environment } from 'src/shared/constants/environment.enum';
import { Customer } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PLAN_LOOKUP_KEYS } from 'src/shared/constants/stripe';

@Injectable()
export class StripePaymentayment extends Payment {
  constructor(
    @Inject('STRIPE') private readonly stripe: Stripe,
    private readonly configService: ConfigService
  ) {
    super();
  }

  async findCustomer(email: string): Promise<Customer | null> {
    const customers = await this.stripe.customers
      .search({
        query: `email:"${email}"`
      })
      .then((res) => res.data);

    if (customers.length !== 1) {
      return null;
    }

    return {
      email,
      id: customers[0].id
    };
  }

  async createCustomer(email: string): Promise<Customer> {
    const findedCustomer = await this.findCustomer(email);

    if (findedCustomer) {
      throw new ConflictException('Customer already exists in stripe');
    }

    const { id } = await this.stripe.customers.create({
      email
    });

    return {
      id,
      email
    };
  }

  async getCurrentTime(): Promise<number> {
    let currentTime: number;
    if (this.configService.get('NODE_ENV') === Environment.Development) {
      const testClocks = await this.stripe.testHelpers.testClocks.list({
        limit: 1
      });

      if (testClocks.data.length > 0) {
        currentTime = testClocks.data[0].frozen_time;
      } else {
        currentTime = getEndOfDayTimestamp();
      }
    } else {
      currentTime = getEndOfDayTimestamp();
    }

    return currentTime;
  }

  async createInvoice({
    customerId,
    priceId
  }: InvoiceData): Promise<InvoiceResult> {
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
      subscriptionPaymentId: subscription.id,
      clientSecret: intent.client_secret as string
    };
  }

  async updateDefaultPaymentMethod({
    paymentIntentId,
    subscriptionId
  }: PaymentMethodUpdateData): Promise<void> {
    const payment_intent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    const paymentMethodId =
      typeof payment_intent.payment_method === 'string'
        ? payment_intent.payment_method
        : payment_intent.payment_method!.id;

    await this.stripe.subscriptions.update(subscriptionId, {
      default_payment_method: paymentMethodId
    });
  }

  async constructEventFromPayload(
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

  async getPrices(): Promise<Price[]> {
    return await this.stripe.prices
      .list({
        lookup_keys: [...PLAN_LOOKUP_KEYS],
        expand: ['data.product']
      })
      .then((res) => res.data);
  }
}
