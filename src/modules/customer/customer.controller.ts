import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Response } from 'express';
import { COOKIE_MAX_AGE, COOKIES } from 'src/shared/constants/cookies';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body() { email }: CreateCustomerDto,
    @Res() response: Response
  ) {
    const customer = await this.customerService.create(email);

    response.cookie(COOKIES.CUSTOMER, customer.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true
    });

    return response.status(HttpStatus.OK).json(customer);
  }

  @Get()
  async getCustomer(@Query('email') email: string, @Res() response: Response) {
    const customer = await this.customerService.findByEmail(email);

    if (customer.data.length === 0) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Customer not found' });
    }

    response.cookie(COOKIES.CUSTOMER, customer.data[0].id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true
    });

    response.status(HttpStatus.OK).json(customer.data);

    return response.status(HttpStatus.OK).json(customer.data);
  }
}
