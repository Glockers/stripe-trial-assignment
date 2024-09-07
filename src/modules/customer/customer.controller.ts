import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { COOKIE_MAX_AGE, COOKIES } from 'src/shared/constants/cookies';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerService } from './customer.service';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'src/shared/constants/environment.enum';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  async createCustomer(
    @Body() { email }: CreateCustomerDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const customer = await this.customerService.create(email);
    const isProd =
      this.configService.get('NODE_ENV') === Environment.Production;
    response.cookie(COOKIES.CUSTOMER, customer.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: isProd
    });

    return response.status(HttpStatus.OK).json(customer);
  }

  @Get()
  async getCustomer(@Query('email') email: string, @Res() response: Response) {
    const customer = await this.customerService.findOneByEmail(email);

    if (!customer) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Customer not found' });
    }

    const isProd =
      this.configService.get('NODE_ENV') === Environment.Production;
    response.cookie(COOKIES.CUSTOMER, customer.id, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: isProd
    });

    return response.status(HttpStatus.OK).json(customer);
  }
}
