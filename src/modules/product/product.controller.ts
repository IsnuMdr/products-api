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

@Controller('/')
@UseGuards(ApiKeyGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return ResponseUtil.success(product);
  }

  @Get('products')
  async findAll(@Query() queryProductDto: QueryProductDto) {
    const { products, meta } = await this.productService.findAll(queryProductDto);
    return ResponseUtil.success(products, meta);
  }

  @Get('search')
  async search(@Query() queryProductDto: QueryProductDto) {
    const { products, meta } = await this.productService.findAll(queryProductDto);
    return ResponseUtil.success(products, meta);
  }

  @Get('products/:id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return ResponseUtil.success(product);
  }

  @Patch('products/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, updateProductDto);
    return ResponseUtil.success(product);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return ResponseUtil.success();
  }

  @Patch('products/:id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    const product = await this.productService.updateStock(id, quantity);
    return ResponseUtil.success(product);
  }
}