import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { ResponseUtil } from '../../common/utils/response.util';

@Controller('products')
@UseGuards(ApiKeyGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return ResponseUtil.success('Product created successfully', product);
  }

  @Get()
  async findAll(@Query() queryProductDto: QueryProductDto) {
    const { products, meta } = await this.productService.findAll(queryProductDto);
    return ResponseUtil.success('Products retrieved successfully', products, meta);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return ResponseUtil.success('Product retrieved successfully', product);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, updateProductDto);
    return ResponseUtil.success('Product updated successfully', product);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return ResponseUtil.success('Product deleted successfully');
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    const product = await this.productService.updateStock(id, quantity);
    return ResponseUtil.success('Product stock updated successfully', product);
  }
}