import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('STRIPE') private readonly stripe: Stripe,
    private readonly prismaService: PrismaService
  ) {}

  public async create(email: string) {
    const resSearch = await this.findByEmail(email);

    if (resSearch.data.length > 0) {
      throw new ConflictException('Customer already exists');
    }
    const createdStripeCustomer = await this.stripe.customers.create({
      email
    });

    await this.prismaService.customer.create({
      data: {
        id: createdStripeCustomer.id,
        email
      }
    });

    return createdStripeCustomer;
  }

  public async findByEmail(email: string) {
    return await this.stripe.customers.search({
      query: `email:"${email}"`
    });
  }

  public async deleteByStripeId(id): Promise<void> {
    await this.prismaService.customer.delete({
      where: {
        id
      }
    });
  }
}
