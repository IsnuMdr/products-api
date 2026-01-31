import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductCommandRepository } from './repositories/product-command.repository';
import { ProductQueryRepository } from './repositories/product-query.repository';
import { CategoryService } from '../category/category.service';
import { PaginationMeta } from '../../common/interfaces/api-response.interface';
import { Prisma } from '@prisma/query-client';
import { RedisService } from '../../config/redis.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly commandRepository: ProductCommandRepository,
    private readonly queryRepository: ProductQueryRepository,
    private readonly categoryService: CategoryService,
    private readonly redisService: RedisService,
  ) { }

  // COMMAND - Write to Command DB
  async create(createProductDto: CreateProductDto) {
    // Verify category exists
    await this.categoryService.findOne(createProductDto.categoryId);

    // Create in Command DB
    const product = await this.commandRepository.create(createProductDto);

    // Publish event to Redis for sync to Query DB
    await this.redisService.publish('product.created', {
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price.toString(),
      stock: product.stock,
      categoryId: product.categoryId,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    });

    return product;
  }

  // QUERY - Read from Query DB
  async findAll(queryProductDto: QueryProductDto) {
    const { page = 1, limit = 10, sku, name, 'category.id': categoryIds, 'category.name': categoryNames } = queryProductDto;
    const priceStart = queryProductDto['price.start'];
    const priceEnd = queryProductDto['price.end'];
    const stockStart = queryProductDto['stock.start'];
    const stockEnd = queryProductDto['stock.end'];

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: Prisma.ProductWhereInput = {};
    const andConditions: Prisma.ProductWhereInput[] = [];

    // SKU filter (multiple values with OR)
    if (sku && sku.length > 0) {
      andConditions.push({
        sku: { in: sku }
      });
    }

    // Name filter (multiple values with OR using LIKE)
    if (name && name.length > 0) {
      andConditions.push({
        OR: name.map(n => ({
          name: { contains: n, mode: 'insensitive' }
        }))
      });
    }

    // Price range filter
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

    // Stock range filter
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

    // Category ID filter (multiple values with OR)
    if (categoryIds && categoryIds.length > 0) {
      andConditions.push({
        categoryId: { in: categoryIds }
      });
    }

    // Category Name filter (multiple values with OR)
    if (categoryNames && categoryNames.length > 0) {
      andConditions.push({
        category: {
          name: { in: categoryNames }
        }
      });
    }

    // Combine all conditions with AND
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [products, total] = await Promise.all([
      this.queryRepository.findAll(skip, limit, where),
      this.queryRepository.count(where),
    ]);

    const meta: PaginationMeta = {
      current: page,
      size: limit,
      total,
    };

    return { products, meta };
  }

  // QUERY - Read from Query DB
  async findOne(id: string) {
    const product = await this.queryRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // COMMAND - Write to Command DB
  async update(id: string, updateProductDto: UpdateProductDto) {
    // Check if exists in Command DB
    const existingProduct = await this.commandRepository.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductDto.categoryId) {
      await this.categoryService.findOne(updateProductDto.categoryId);
    }

    // Update in Command DB
    const product = await this.commandRepository.update(id, updateProductDto);

    // Publish event to Redis for sync to Query DB
    await this.redisService.publish('product.updated', {
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price.toString(),
      stock: product.stock,
      categoryId: product.categoryId,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    });

    return product;
  }

  // COMMAND - Write to Command DB
  async remove(id: string) {
    // Check if exists in Command DB
    const existingProduct = await this.commandRepository.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Delete from Command DB
    const result = await this.commandRepository.remove(id);

    // Publish event to Redis for sync to Query DB
    await this.redisService.publish('product.deleted', {
      productId: id,
    });

    return result;
  }

  // COMMAND - Write to Command DB
  async updateStock(id: string, quantity: number) {
    const product = await this.commandRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.update(id, { stock: newStock });
  }
}