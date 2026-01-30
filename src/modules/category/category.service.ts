import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './repositories/category.repository';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationMeta } from '../../common/interfaces/api-response.interface';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) { }

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if category with same name exists
    const existingCategory = await this.categoryRepository.findByName(
      createCategoryDto.name,
    );

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    return this.categoryRepository.create(createCategoryDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.categoryRepository.findAll(skip, limit),
      this.categoryRepository.count(),
    ]);

    const meta: PaginationMeta = {
      current: page,
      size: limit,
      total,
    };

    return { categories, meta };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    // Check if new name conflicts with existing category
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findByName(
        updateCategoryDto.name,
      );

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.categoryRepository.remove(id);
  }
}