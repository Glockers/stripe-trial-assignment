import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StripeModule } from './modules/stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SubscriptionModule,
    StripeModule,
    CustomerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
