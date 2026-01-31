import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationMeta } from '../../common/interfaces/api-response.interface';
import { CategoryCommandRepository } from './repositories/category-command.repository';
import { CategoryQueryRepository } from './repositories/category-query.repository';
import { RedisService } from 'src/config/redis.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly commandRepository: CategoryCommandRepository,
    private readonly queryRepository: CategoryQueryRepository,
    private readonly redisService: RedisService,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if category with same name exists
    const existingCategory = await this.queryRepository.findByName(
      createCategoryDto.name,
    );

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = await this.commandRepository.create(createCategoryDto);

    await this.redisService.publish('category.created', category);

    return category;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.queryRepository.findAll(skip, limit),
      this.queryRepository.count(),
    ]);

    const meta: PaginationMeta = {
      current: page,
      size: limit,
      total,
    };

    return { categories, meta };
  }

  async findOne(id: string) {
    const category = await this.queryRepository.findOne(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}