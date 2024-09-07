import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async save({ email, id }: Customer) {
    return await this.prismaService.customer.create({
      data: {
        id,
        email
      }
    });
  }

  public async deleteOne(id): Promise<Customer> {
    return await this.prismaService.customer.delete({
      where: {
        id
      }
    });
  }
}
