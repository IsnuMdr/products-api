import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductCommandRepository } from './repositories/product-command.repository';
import { ProductQueryRepository } from './repositories/product-query.repository';
import { CommandPrismaService } from '../../config/command-prisma.service';
import { QueryPrismaService } from '../../config/query-prisma.service';
import { RedisService } from '../../config/redis.service';
import { CategoryModule } from '../category/category.module';
import { ProductSyncHandler } from './handlers/product-sync.handler';

@Module({
  imports: [CategoryModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductCommandRepository,
    ProductQueryRepository,
    CommandPrismaService,
    QueryPrismaService,
    RedisService,
    ProductSyncHandler,
  ],
  exports: [ProductService],
})
export class ProductModule { }