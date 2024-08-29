import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Cookies } from 'src/shared/decorators/cookie.decorator';
import { COOKIES } from 'src/shared/constants/cookies';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(
    @Body() { priceId }: CreateSubscriptionDto,
    @Cookies(COOKIES.CUSTOMER)
    customerId: string
  ) {
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
