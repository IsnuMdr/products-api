import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
      include: {
        category: true,
      },
    });
  }

  async findAll(
    skip: number,
    take: number,
    where?: Prisma.ProductWhereInput,
  ) {
    return this.prisma.product.findMany({
      skip,
      take,
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where?: Prisma.ProductWhereInput) {
    return this.prisma.product.count({ where });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findBySku(sku: string) {
    return this.prisma.product.findUnique({
      where: { sku },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}