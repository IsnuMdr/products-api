
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
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

const productRepositoryMock = {
  create: jest.fn().mockResolvedValue(productMock),
  findAll: jest.fn().mockResolvedValue(productListMock),
  count: jest.fn().mockResolvedValue(1),
  findOne: jest.fn().mockResolvedValue(productMock),
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
        { provide: ProductRepository, useValue: productRepositoryMock },
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
      await expect(service.create(dto)).resolves.toEqual(productMock);
      expect(productRepositoryMock.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return products and meta', async () => {
      const query = {};
      const result = await service.findAll(query);
      expect(result.products).toEqual(productListMock);
      expect(result.meta).toEqual(metaMock);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      await expect(service.findOne('1')).resolves.toEqual(productMock);
      expect(productRepositoryMock.findOne).toHaveBeenCalledWith('1');
    });
    it('should throw NotFoundException if not found', async () => {
      productRepositoryMock.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });
});
