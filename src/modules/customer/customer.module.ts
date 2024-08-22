import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { StripeProvider } from 'src/shared/stripe.provider';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, StripeProvider]
})
export class CustomerModule {}
