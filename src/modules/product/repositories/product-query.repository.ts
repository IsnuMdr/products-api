import { Injectable } from '@nestjs/common';
import { QueryPrismaService } from '../../../config/query-prisma.service';
import { Prisma } from '@prisma/query-client';

@Injectable()
export class ProductQueryRepository {
  constructor(private prisma: QueryPrismaService) { }

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

  // Methods for sync from Command DB
  async createFromSync(data: any) {
    return this.prisma.product.create({
      data: {
        id: data.id,
        sku: data.sku,
        name: data.name,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
    });
  }

  async updateFromSync(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data: {
        sku: data.sku,
        name: data.name,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        updatedAt: new Date(data.updatedAt),
      },
    });
  }

  async deleteFromSync(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async upsertFromSync(data: any) {
    return this.prisma.product.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        sku: data.sku,
        name: data.name,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
      update: {
        sku: data.sku,
        name: data.name,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        updatedAt: new Date(data.updatedAt),
      },
    });
  }
}