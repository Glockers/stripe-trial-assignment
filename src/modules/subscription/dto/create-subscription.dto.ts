import { IsString, Matches } from 'class-validator';
import { PaymentMethodUpdateData } from 'src/modules/payment/entity/payment';

export interface ICreateSubscription {
  id: string;
  period: {
    end: number;
    start: number;
  };
  customerId: string;
  priceId: string;
}

export class CreateSubscriptionDto {
  @IsString()
  @Matches(/^price_/, { message: 'priceId must start with "price_"' })
  priceId: string;
}

export interface SubscribtionData {
  paymentDetails: PaymentMethodUpdateData;
  subscriptionDetails: ICreateSubscription;
}
