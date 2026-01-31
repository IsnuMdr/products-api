
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryCommandRepository } from './repositories/category-command.repository';
import { CategoryQueryRepository } from './repositories/category-query.repository';
import { RedisService } from 'src/config/redis.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const categoryMock = {
  id: '1',
  name: 'Category 1',
  products: [],
};
const categoryListMock = [categoryMock];
const metaMock = { current: 1, size: 10, total: 1 };

const commandRepositoryMock = {
  create: jest.fn().mockResolvedValue(categoryMock),
};
const queryRepositoryMock = {
  findAll: jest.fn().mockResolvedValue(categoryListMock),
  count: jest.fn().mockResolvedValue(1),
  findOne: jest.fn().mockResolvedValue(categoryMock),
  findByName: jest.fn().mockResolvedValue(null),
};
const redisServiceMock = {
  publish: jest.fn().mockResolvedValue(undefined),
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryCommandRepository, useValue: commandRepositoryMock },
        { provide: CategoryQueryRepository, useValue: queryRepositoryMock },
        { provide: RedisService, useValue: redisServiceMock },
      ],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create category', async () => {
      queryRepositoryMock.findByName.mockResolvedValueOnce(null);
      const dto = { name: 'Category 1' };
      await expect(service.create(dto)).resolves.toEqual(categoryMock);
      expect(queryRepositoryMock.findByName).toHaveBeenCalledWith(dto.name);
      expect(commandRepositoryMock.create).toHaveBeenCalledWith(dto);
      expect(redisServiceMock.publish).toHaveBeenCalledWith('category.created', categoryMock);
    });
    it('should throw ConflictException if name exists', async () => {
      queryRepositoryMock.findByName.mockResolvedValueOnce(categoryMock);
      const dto = { name: 'Category 1' };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return categories and meta', async () => {
      const query = { page: 1, limit: 10 };
      queryRepositoryMock.findAll.mockResolvedValueOnce(categoryListMock);
      queryRepositoryMock.count.mockResolvedValueOnce(1);
      const result = await service.findAll(query);
      expect(result.categories).toEqual(categoryListMock);
      expect(result.meta).toEqual({ current: 1, size: 10, total: 1 });
      expect(queryRepositoryMock.findAll).toHaveBeenCalled();
      expect(queryRepositoryMock.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      queryRepositoryMock.findOne.mockResolvedValueOnce(categoryMock);
      await expect(service.findOne('1')).resolves.toEqual(categoryMock);
      expect(queryRepositoryMock.findOne).toHaveBeenCalledWith('1');
    });
    it('should throw NotFoundException if not found', async () => {
      queryRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });
});
