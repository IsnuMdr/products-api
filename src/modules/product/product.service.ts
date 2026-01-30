import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductRepository } from './repositories/product.repository';
import { CategoryService } from '../category/category.service';
import { PaginationMeta } from '../../common/interfaces/api-response.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) { }

  async create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  async findAll(queryProductDto: QueryProductDto) {
    const { page = 1, limit = 10, sku, name, 'category.id': categoryIds, 'category.name': categoryNames } = queryProductDto;
    const priceStart = queryProductDto['price.start'];
    const priceEnd = queryProductDto['price.end'];
    const stockStart = queryProductDto['stock.start'];
    const stockEnd = queryProductDto['stock.end'];

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    const andConditions: Prisma.ProductWhereInput[] = [];

    if (sku && sku.length > 0) {
      andConditions.push({
        sku: { in: sku }
      });
    }

    if (name && name.length > 0) {
      andConditions.push({
        OR: name.map(n => ({
          name: { contains: n, mode: 'insensitive' }
        }))
      });
    }

    if (priceStart !== undefined || priceEnd !== undefined) {
      const priceCondition: any = {};
      if (priceStart !== undefined) {
        priceCondition.gte = priceStart;
      }
      if (priceEnd !== undefined) {
        priceCondition.lte = priceEnd;
      }
      andConditions.push({ price: priceCondition });
    }

    if (stockStart !== undefined || stockEnd !== undefined) {
      const stockCondition: any = {};
      if (stockStart !== undefined) {
        stockCondition.gte = stockStart;
      }
      if (stockEnd !== undefined) {
        stockCondition.lte = stockEnd;
      }
      andConditions.push({ stock: stockCondition });
    }

    if (categoryIds && categoryIds.length > 0) {
      andConditions.push({
        categoryId: { in: categoryIds }
      });
    }

    if (categoryNames && categoryNames.length > 0) {
      andConditions.push({
        category: {
          name: { in: categoryNames }
        }
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [products, total] = await Promise.all([
      this.productRepository.findAll(skip, limit, where),
      this.productRepository.count(where),
    ]);

    const meta: PaginationMeta = {
      current: page,
      size: limit,
      total,
    };

    return { products, meta };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}