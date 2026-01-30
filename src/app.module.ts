import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-execption.filter';
import { GlobalValidationPipe } from './common/pipes/validation.pipe';
import { UniqueValidator } from './common/validators/is-unique.validator';
import { PrismaService } from './config/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
    ProductModule,
    CategoryModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    UniqueValidator,
    PrismaService
  ],
})
export class AppModule { }
