import { ICreateSubscription } from './create-subscription.dto';

export interface IExtendSubscription
  extends Omit<ICreateSubscription, 'customerId' | 'priceId'> {}
