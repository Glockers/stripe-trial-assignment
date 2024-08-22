import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Request, Response } from 'express';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Req() request: Request, @Res() response: Response) {
    const { email } = request.body;
    const customer = await this.customerService.createCustomer(email);

    response.cookie('customer', customer.id, {
      maxAge: 90000,
      httpOnly: true
    });

    return response.status(HttpStatus.OK).json(customer);
  }

  @Get()
  async getCustomer(@Query('email') email: string, @Res() response: Response) {
    const customer = await this.customerService.getCustomer(email);
    response.cookie('customer', customer.data[0].id, {
      maxAge: 90000,
      httpOnly: true
    });

    return response.status(HttpStatus.OK).json(customer.data);
  }
}
