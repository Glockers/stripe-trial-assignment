import { Module } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { StripeModule } from '../payment/stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [CustomerController],
  providers: [CustomerRepository, CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}
