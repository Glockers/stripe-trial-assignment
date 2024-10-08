import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { PLAN_LOOKUP_KEYS } from 'src/shared/constants/stripe';
import {
  convertUnixTimestampToDate,
  getEndOfDayTimestamp
} from 'src/shared/utils/date';
import Stripe from 'stripe';
import { ICreateSubscription } from './dto/create-subscription.dto';
import { IExtendSubscription } from './dto/extend-subscription.dto';
import { IUpdateDefaultPaymentMethod } from './dto/update-default-payment.dto';
import { Environment } from 'src/shared/constants/environment.enum';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('STRIPE') private readonly stripe: Stripe,
    @InjectPinoLogger(SubscriptionService.name)
    private readonly logger: PinoLogger,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  public async create({ customerId, priceId }: any) {
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
      subscriptionId: subscription.id,
      clientSecret: intent.client_secret
    };
  }

  async getPlans() {
    return await this.stripe.prices.list({
      lookup_keys: [...PLAN_LOOKUP_KEYS],
      expand: ['data.product']
    });
  }

  public async updateDefaultPaymentMethod({
    payment_intent_id,
    subscription_id
  }: IUpdateDefaultPaymentMethod) {
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

      this.logger.info(
        'Default payment method set for subscription:' +
          payment_intent.payment_method
      );

      return subscription;
    } catch (err) {
      this.logger.error(err);
      this.logger.error(
        `⚠️  Failed to update the default payment method for subscription: ${subscription_id}`
      );
    }
  }

  public async save({
    id,
    period: { end, start },
    customerId,
    priceId
  }: ICreateSubscription) {
    return await this.prismaService.subscription.create({
      data: {
        id,
        endDate: convertUnixTimestampToDate(end),
        startDate: convertUnixTimestampToDate(start),
        customerId,
        priceId
      }
    });
  }

  public async extend({ id, period: { end } }: IExtendSubscription) {
    return await this.prismaService.subscription.update({
      where: {
        id
      },
      data: {
        endDate: convertUnixTimestampToDate(end)
      }
    });
  }

  public async checkAccess(userId: string) {
    let currentTime: number;
    if (this.configService.get('NODE_ENV') !== Environment.Production) {
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

    if (!userId) {
      throw new BadRequestException('UserId is empty');
    }

    return await this.prismaService.subscription.findMany({
      where: {
        customer: {
          id: userId
        },
        endDate: {
          gt: convertUnixTimestampToDate(currentTime)
        }
      }
    });
  }
}
