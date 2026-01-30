
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repositories/category.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';

const categoryMock = {
  id: '1',
  name: 'Category 1',
  products: [],
};
const categoryListMock = [categoryMock];
const metaMock = { current: 1, size: 10, total: 1 };

const categoryRepositoryMock = {
  create: jest.fn().mockResolvedValue(categoryMock),
  findAll: jest.fn().mockResolvedValue(categoryListMock),
  count: jest.fn().mockResolvedValue(1),
  findOne: jest.fn().mockResolvedValue(categoryMock),
  findByName: jest.fn().mockResolvedValue(null),
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryRepository, useValue: categoryRepositoryMock },
      ],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create category', async () => {
      categoryRepositoryMock.findByName.mockResolvedValueOnce(null);
      const dto = { name: 'Category 1' };
      await expect(service.create(dto)).resolves.toEqual(categoryMock);
      expect(categoryRepositoryMock.create).toHaveBeenCalledWith(dto);
    });
    it('should throw ConflictException if name exists', async () => {
      categoryRepositoryMock.findByName.mockResolvedValueOnce(categoryMock);
      const dto = { name: 'Category 1' };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return categories and meta', async () => {
      const query = { page: 1, limit: 10 };
      const result = await service.findAll(query);
      expect(result.categories).toEqual(categoryListMock);
      expect(result.meta).toEqual(metaMock);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      categoryRepositoryMock.findOne.mockResolvedValueOnce(categoryMock);
      await expect(service.findOne('1')).resolves.toEqual(categoryMock);
      expect(categoryRepositoryMock.findOne).toHaveBeenCalledWith('1');
    });
    it('should throw NotFoundException if not found', async () => {
      categoryRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });
});
