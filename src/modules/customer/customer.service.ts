import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class CustomerService {
  constructor(@Inject('STRIPE') private readonly stripe: Stripe) {}

  public async createCustomer(email: string) {
    return await this.stripe.customers.create({
      email
    });
  }
  public async getCustomer(email: string) {
    return await this.stripe.customers.search({
      query: `email:"${email}"`
    });
  }
}
