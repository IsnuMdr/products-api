
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductCommandRepository } from './repositories/product-command.repository';
import { ProductQueryRepository } from './repositories/product-query.repository';
import { RedisService } from '../../config/redis.service';
import { CategoryService } from '../category/category.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const productMock = {
  id: '1',
  name: 'Test Product',
  sku: 'SKU1',
  price: 100,
  stock: 10,
  categoryId: 'cat1',
  category: { id: 'cat1', name: 'Category 1' },
};

const productListMock = [productMock];
const metaMock = { current: 1, size: 10, total: 1 };


const commandRepositoryMock = {
  create: jest.fn().mockResolvedValue(productMock),
  findOne: jest.fn().mockResolvedValue(productMock),
  findBySku: jest.fn().mockResolvedValue(null),
};

const queryRepositoryMock = {
  findAll: jest.fn().mockResolvedValue(productListMock),
  count: jest.fn().mockResolvedValue(1),
  findOne: jest.fn().mockResolvedValue(productMock),
};

const redisServiceMock = {
  publish: jest.fn().mockResolvedValue(undefined),
};

const categoryServiceMock = {
  findOne: jest.fn().mockResolvedValue(productMock.category),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductCommandRepository, useValue: commandRepositoryMock },
        { provide: ProductQueryRepository, useValue: queryRepositoryMock },
        { provide: RedisService, useValue: redisServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { name: 'Test', sku: 'SKU1', price: 100, stock: 10, categoryId: 'cat1' };
      commandRepositoryMock.findBySku.mockResolvedValueOnce(null);
      await expect(service.create(dto)).resolves.toEqual(productMock);
      expect(categoryServiceMock.findOne).toHaveBeenCalledWith(dto.categoryId);
      expect(commandRepositoryMock.findBySku).toHaveBeenCalledWith(dto.sku);
      expect(commandRepositoryMock.create).toHaveBeenCalledWith(dto);
      expect(redisServiceMock.publish).toHaveBeenCalledWith('product.created', expect.objectContaining({
        id: productMock.id,
        sku: productMock.sku,
        name: productMock.name,
        price: productMock.price.toString(),
        stock: productMock.stock,
        categoryId: productMock.categoryId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }));
    });

    it('should throw ConflictException if SKU exists', async () => {
      const dto = { name: 'Test', sku: 'SKU1', price: 100, stock: 10, categoryId: 'cat1' };
      commandRepositoryMock.findBySku.mockResolvedValueOnce(productMock);
      await expect(service.create(dto)).rejects.toThrow('Product with this SKU already exists');
    });
  });

  describe('findAll', () => {
    it('should return products and meta', async () => {
      const query = { page: 1, limit: 10 };
      queryRepositoryMock.findAll.mockResolvedValueOnce(productListMock);
      queryRepositoryMock.count.mockResolvedValueOnce(1);
      const result = await service.findAll(query);
      expect(result.products).toEqual(productListMock);
      expect(result.meta).toEqual({ current: 1, size: 10, total: 1 });
      expect(queryRepositoryMock.findAll).toHaveBeenCalled();
      expect(queryRepositoryMock.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      await expect(service.findOne('1')).resolves.toEqual(productMock);
      expect(queryRepositoryMock.findOne).toHaveBeenCalledWith('1');
    });
    it('should throw NotFoundException if not found', async () => {
      queryRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });
});
