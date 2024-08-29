import { CreateSubscriptionDto } from './create-subscription.dto';

export interface ExtendSubscriptionDto
  extends Omit<CreateSubscriptionDto, 'customerId' | 'priceId'> {}
