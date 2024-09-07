import { Customer } from '@prisma/client';

export type InvoiceResult = {
  subscriptionPaymentId: string;
  clientSecret: string;
};

export type InvoiceData = {
  customerId: string;
  priceId: string;
};

export type PaymentMethodUpdateData = {
  paymentIntentId: string;
  subscriptionId: string;
};

export type Price = {
  id: string;
  currency: string;
};

export abstract class Payment {
  abstract createCustomer(email: string): Promise<Customer>;
  abstract findCustomer(email: string): Promise<Customer | null>;
  abstract createInvoice(data: InvoiceData): Promise<InvoiceResult>;
  abstract updateDefaultPaymentMethod(
    data: PaymentMethodUpdateData
  ): Promise<void>;
  abstract getCurrentTime(): Promise<number>;
  abstract getPrices(): Promise<Price[]>;
}
