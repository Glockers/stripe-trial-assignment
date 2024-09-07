import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { convertUnixTimestampToDate } from 'src/shared/utils/date';
import { ICreateSubscription } from './dto/create-subscription.dto';
import { IExtendSubscription } from './dto/extend-subscription.dto';
import { InvoiceData } from '../payment/entity/payment';

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async save({
    id,
    period: { end, start },
    customerId,
    priceId
  }: ICreateSubscription) {
    return await this.prismaService.subscription.create({
      data: {
        id,
        endDate: convertUnixTimestampToDate(end),
        startDate: convertUnixTimestampToDate(start),
        customerId,
        priceId
      }
    });
  }

  public async extend({ id, period: { end } }: IExtendSubscription) {
    return await this.prismaService.subscription.update({
      where: {
        id
      },
      data: {
        endDate: convertUnixTimestampToDate(end)
      }
    });
  }

  public async getAvailableAccess(userId: string, currentTime: number) {
    return await this.prismaService.subscription.findMany({
      where: {
        customer: {
          id: userId
        },
        endDate: {
          gt: convertUnixTimestampToDate(currentTime)
        }
      }
    });
  }

  async hasUserActiveSub({ customerId, priceId }: InvoiceData) {
    return await this.prismaService.subscription.findFirst({
      where: {
        customerId,
        priceId
      }
    });
  }

  async delete(id: string) {
    try {
      return await this.prismaService.subscription.delete({
        where: {
          id
        }
      });
    } catch (err) {
      return null;
    }
  }
}
