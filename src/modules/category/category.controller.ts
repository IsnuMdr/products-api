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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
    return ResponseUtil.success('Category created successfully', category);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { categories, meta } = await this.categoryService.findAll(paginationDto);
    return ResponseUtil.success('Categories retrieved successfully', categories, meta);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(id);
    return ResponseUtil.success('Category retrieved successfully', category);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(id, updateCategoryDto);
    return ResponseUtil.success('Category updated successfully', category);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
    return ResponseUtil.success('Category deleted successfully');
  }
}