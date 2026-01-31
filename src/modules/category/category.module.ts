import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CommandPrismaService } from '../../config/command-prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CommandPrismaService],
  exports: [CategoryService],
})
export class CategoryModule { }