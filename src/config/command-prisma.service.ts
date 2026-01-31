import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient as CommandPrismaClient } from '@prisma/command-client';

@Injectable()
export class CommandPrismaService extends CommandPrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CommandPrismaService.name);

  constructor() {
    super({
      log: ['error', 'warn'],
      datasources: {
        commandDb: {
          url: process.env.COMMAND_DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Command Database (Write) connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to Command Database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Command Database disconnected');
  }
}