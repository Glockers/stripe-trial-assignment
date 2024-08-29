import { Global, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Logger as NestLogger } from '@nestjs/common';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      NestLogger.log('Database connected successfully', 'Prisma');
    } catch (error) {
      NestLogger.error(`Error connecting to the database: ${error}`, 'Prisma');
    }
  }
}
