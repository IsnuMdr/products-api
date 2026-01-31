import { Injectable } from '@nestjs/common';
import { CommandPrismaService } from 'src/config/command-prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: CommandPrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { createdAt, updatedAt, ...rest } = createCategoryDto as any;
    return this.prisma.category.create({
      data: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    }).then(category => ({
      ...category,
      createdAt: category.createdAt.getTime(),
      updatedAt: category.updatedAt.getTime(),
    }));
  }

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

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { createdAt, updatedAt, ...rest } = updateCategoryDto as any;
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...rest,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
      },
    });
    return {
      ...category,
      createdAt: category.createdAt.getTime(),
      updatedAt: category.updatedAt.getTime(),
    };
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}