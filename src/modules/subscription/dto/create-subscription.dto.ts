export interface CreateSubscriptionDto {
  id: string;
  period: {
    end: number;
    start: number;
  };
  customerId: string;
  priceId: string;
}
