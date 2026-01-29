import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repositories/product.repository';
import { PrismaService } from '../../config/prisma.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [CategoryModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, PrismaService],
  exports: [ProductService],
})
export class ProductModule { }