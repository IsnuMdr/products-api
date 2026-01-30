import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { ResponseUtil } from '../../common/utils/response.util';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('categories')
@UseGuards(ApiKeyGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return ResponseUtil.success(category);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { categories, meta } = await this.categoryService.findAll(paginationDto);
    return ResponseUtil.success(categories, meta);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return ResponseUtil.success(category);
  }
}