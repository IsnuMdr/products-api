import { Injectable } from '@nestjs/common';
import { QueryPrismaService } from 'src/config/query-prisma.service';

@Injectable()
export class CategoryQueryRepository {
  constructor(private prisma: QueryPrismaService) { }

  async findAll(skip: number, take: number) {
    const categories = await this.prisma.category.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return categories.map(category => ({
      ...category,
      createdAt: category.createdAt.getTime(),
      updatedAt: category.updatedAt.getTime(),
    }));
  }

  async count() {
    return this.prisma.category.count();
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    if (!category) return null;
    return {
      ...category,
      createdAt: category.createdAt.getTime(),
      updatedAt: category.updatedAt.getTime(),
      products: category.products ? category.products.map(product => ({
        ...product,
        createdAt: product.createdAt.getTime(),
        updatedAt: product.updatedAt.getTime(),
      })) : undefined,
    };
  }

  async findByName(name: string) {
    return this.prisma.category.findUnique({
      where: { name },
    });
  }

  async createFromSync(data: any) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
    });
  }

  async updateFromSync(id: string, data: any) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        updatedAt: new Date(data.updatedAt),
      },
    });
  }

  async deleteFromSync(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async upsertFromSync(data: any) {
    return this.prisma.category.upsert({
      where: { id: data.id },
      create: {
        name: data.name,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
      update: {
        name: data.name,
        updatedAt: new Date(data.updatedAt),
      },
    });
  }
}