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
    // Verify category exists
    await this.categoryService.findOne(createProductDto.categoryId);

    // Check if product with same SKU exists
    const existingProduct = await this.productRepository.findBySku(
      createProductDto.sku,
    );

    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    return this.productRepository.create(createProductDto);
  }

  async findAll(queryProductDto: QueryProductDto) {
    const { page = 1, limit = 10, search, categoryId } = queryProductDto;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    // Verify category exists if categoryId is being updated
    if (updateProductDto.categoryId) {
      await this.categoryService.findOne(updateProductDto.categoryId);
    }

    // Check if new SKU conflicts with existing product
    if (updateProductDto.sku) {
      const existingProduct = await this.productRepository.findBySku(
        updateProductDto.sku,
      );

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    return this.productRepository.update(id, updateProductDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.productRepository.remove(id);
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.findOne(id);

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.productRepository.update(id, { stock: newStock });
  }
}