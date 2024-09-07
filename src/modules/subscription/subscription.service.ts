import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { InvoiceData, InvoiceResult } from '../payment/entity/payment';
import { SubscribtionData } from './dto/create-subscription.dto';
import { StripePaymentayment } from '../payment/stripe/stripe-payment.service';
import { IExtendSubscription } from './dto/extend-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly payment: StripePaymentayment
  ) {}

  async createInvoice(data: InvoiceData): Promise<InvoiceResult> {
    const isActiveSub =
      await this.subscriptionRepository.hasUserActiveSub(data);

    if (isActiveSub) {
      return null;
    }

    return await this.payment.createInvoice(data);
  }

  async subscriptionSave({
    paymentDetails,
    subscriptionDetails
  }: SubscribtionData) {
    await this.payment.updateDefaultPaymentMethod(paymentDetails);
    return await this.subscriptionRepository.save(subscriptionDetails);
  }

  async subscriptionExtend(data: IExtendSubscription) {
    return await this.subscriptionRepository.extend(data);
  }

  async checkAccess(userId: string) {
    const time = await this.payment.getCurrentTime();
    return await this.subscriptionRepository.getAvailableAccess(userId, time);
  }

  async getProducts() {
    return await this.payment.getPrices();
  }

  async cancelSubscription(id: string) {
    const result = await this.subscriptionRepository.delete(id);

    if (!result) {
      throw new NotFoundException(`Subscription: ${id} wasn't found`);
    }

    return result;
  }
}
