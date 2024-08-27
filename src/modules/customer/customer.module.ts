import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { StripeProvider } from 'src/shared/providers/stripe.provider';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, StripeProvider],
  exports: [CustomerService]
})
export class CustomerModule {}
