import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class StripeService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkDublicateEvents(eventStripeId: string, type: string) {
    const isSelected = await this.prismaService.events.findFirst({
      where: {
        id: eventStripeId
      }
    });

    if (isSelected) {
      return true;
    }

    await this.prismaService.events.create({
      data: {
        eventStripeId,
        type
      }
    });

    throw new InternalServerErrorException(`Duplicate event: ${type}`);
  }
}
