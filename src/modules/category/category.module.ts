import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CommandPrismaService } from '../../config/command-prisma.service';
import { CategoryCommandRepository } from './repositories/category-command.repository';
import { CategoryQueryRepository } from './repositories/category-query.repository';
import { RedisService } from 'src/config/redis.service';
import { CategorySyncHandler } from './handlers/product-sync.handler';
import { QueryPrismaService } from 'src/config/query-prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryCommandRepository,
    CategoryQueryRepository,
    CommandPrismaService,
    QueryPrismaService,
    RedisService,
    CategorySyncHandler
  ],
  exports: [CategoryService],
})
export class CategoryModule { }