import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Cookies } from 'src/shared/decorators/cookie.decorator';
import { COOKIES } from 'src/shared/constants/cookies';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';
import { DeleteSubscriptionDto } from './dto/delete-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(
    @Body() { priceId }: CreateSubscriptionDto,
    @Cookies(COOKIES.CUSTOMER)
    customerId: string
  ) {
    return await this.subscriptionService.createInvoice({
      customerId,
      priceId
    });
  }

  @Get('/plans')
  public getPlans() {
    return this.subscriptionService.getProducts();
  }

  @Get('/access')
  public async getAccess(@Cookies(COOKIES.CUSTOMER) customerId: string) {
    return await this.subscriptionService.checkAccess(customerId);
  }

  @Delete()
  public async delete(@Body() { id }: DeleteSubscriptionDto) {
    return await this.subscriptionService.cancelSubscription(id);
  }
}
