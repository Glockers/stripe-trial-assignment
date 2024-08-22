import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Request } from 'express';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(@Req() req: Request) {
    const priceId = req.body.priceId;
    const customerId = req.cookies['customer'];

    if (!priceId || !customerId)
      throw new BadRequestException('priceId or customerId are empty');

    return this.subscriptionService.create({ customerId, priceId });
  }

  @Get('/plans')
  public getPlans() {
    return this.subscriptionService.getPlans();
  }
}
