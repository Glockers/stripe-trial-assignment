import { Module } from '@nestjs/common';
import { StripeModule } from './modules/stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CustomerModule } from './modules/customer/customer.module';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './infra/prisma/prisma.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    SubscriptionModule,
    StripeModule,
    CustomerModule
  ]
})
export class AppModule {}
