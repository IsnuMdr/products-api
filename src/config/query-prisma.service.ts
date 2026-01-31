import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient as QueryPrismaClient } from '@prisma/query-client';

@Injectable()
export class QueryPrismaService extends QueryPrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueryPrismaService.name);

  constructor() {
    super({
      log: ['error', 'warn'],
      datasources: {
        queryDb: {
          url: process.env.QUERY_DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Query Database (Read) connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to Query Database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Query Database disconnected');
  }
}