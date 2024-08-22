export interface CreateSubscription {
  customerId: string;
  priceId: string;
}

export interface UpdatePaymentMethodParams {
  payment_intent_id: string;
  subscription_id: string;
}
