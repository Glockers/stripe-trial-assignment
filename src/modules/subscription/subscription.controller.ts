import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Request } from 'express';
import { Cookies } from 'src/shared/decorators/cookie.decorator';
import { COOKIES } from 'src/shared/constants/cookies';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(
    @Req() req: Request,
    @Cookies(COOKIES.CUSTOMER) customerId: string
  ) {
    const priceId = req.body.priceId;

    if (!priceId || !customerId)
      throw new BadRequestException('priceId or customerId are empty');

    return await this.subscriptionService.create({ customerId, priceId });
  }

  @Get('/plans')
  public getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get('/access')
  public async getAccess(@Cookies(COOKIES.CUSTOMER) customerId: string) {
    return await this.subscriptionService.checkAccess(customerId);
  }
}
