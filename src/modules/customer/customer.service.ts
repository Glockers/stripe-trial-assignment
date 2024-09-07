import { Customer } from '@prisma/client';
import { CustomerRepository } from './customer.repository';
import { Injectable } from '@nestjs/common';
import { StripePaymentayment } from '../payment/stripe/stripe-payment.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly payment: StripePaymentayment
  ) {}

  async deleteCustomer(id: string): Promise<Customer> {
    return await this.customerRepository.deleteOne(id);
  }

  async create(email: string): Promise<Customer> {
    const { id } = await this.payment.createCustomer(email);
    return await this.customerRepository.save({ email, id });
  }

  async findOneByEmail(email: string): Promise<Customer | null> {
    return await this.payment.findCustomer(email);
  }
}
