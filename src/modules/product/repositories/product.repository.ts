import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    const { createdAt, updatedAt, ...rest } = createProductDto as any;
    return this.prisma.product.create({
      data: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
      include: {
        category: true,
      },
    }).then(product => ({
      ...product,
      createdAt: product.createdAt.getTime(),
      updatedAt: product.updatedAt.getTime(),
      category: product.category ? {
        ...product.category,
        createdAt: product.category.createdAt.getTime(),
        updatedAt: product.category.updatedAt.getTime(),
      } : undefined,
    }));
  }

  async findAll(
    skip: number,
    take: number,
    where?: Prisma.ProductWhereInput,
  ) {
    const products = await this.prisma.product.findMany({
      skip,
      take,
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(product => ({
      ...product,
      createdAt: product.createdAt.getTime(),
      updatedAt: product.updatedAt.getTime(),
      category: product.category ? {
        ...product.category,
        createdAt: product.category.createdAt.getTime(),
        updatedAt: product.category.updatedAt.getTime(),
      } : undefined,
    }));
  }

  async count(where?: Prisma.ProductWhereInput) {
    return this.prisma.product.count({ where });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) return null;
    return {
      ...product,
      createdAt: product.createdAt.getTime(),
      updatedAt: product.updatedAt.getTime(),
      category: product.category ? {
        ...product.category,
        createdAt: product.category.createdAt.getTime(),
        updatedAt: product.category.updatedAt.getTime(),
      } : undefined,
    };
  }

  async findBySku(sku: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });
    if (!product) return null;
    return {
      ...product,
      createdAt: product.createdAt.getTime(),
      updatedAt: product.updatedAt.getTime(),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { createdAt, updatedAt, ...rest } = updateProductDto as any;
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
      include: {
        category: true,
      },
    });
    return {
      ...product,
      createdAt: product.createdAt.getTime(),
      updatedAt: product.updatedAt.getTime(),
    };
  }

  async remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}