
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ResponseUtil } from '../../common/utils/response.util';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto } from './dto/create-product.dto';

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

jest.mock('../../common/utils/response.util', () => ({
  ResponseUtil: {
    success: jest.fn((data, meta?) => ({ data, meta, success: true })),
  },
}));

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn().mockResolvedValue(productMock),
      findAll: jest.fn().mockResolvedValue({ products: productListMock, meta: metaMock }),
      findOne: jest.fn().mockResolvedValue(productMock),
    };
    const apiKeyGuardMock = { canActivate: jest.fn().mockReturnValue(true) };
    const configServiceMock = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: serviceMock },
        { provide: ApiKeyGuard, useValue: apiKeyGuardMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).overrideGuard(ApiKeyGuard).useValue(apiKeyGuardMock).compile();
    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create product and return success', async () => {
      const dto = { name: 'Test', sku: 'SKU1', price: 100, stock: 10, categoryId: 'cat1' };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(ResponseUtil.success).toHaveBeenCalledWith(productMock);
      expect(result).toEqual({ data: productMock, success: true });
    });

    it('should throw validation error if required fields are missing', async () => {
      // Simulate validation error thrown by service
      (service.create as jest.Mock).mockRejectedValueOnce({
        status: 400,
        message: 'Validation failed: sku is required',
      });
      const dto: CreateProductDto = {
        name: 'Test', price: 100, stock: 10, categoryId: 'cat1',
        sku: ''
      }; // missing sku
      await expect(controller.create(dto)).rejects.toMatchObject({
        status: 400,
        message: expect.stringContaining('sku is required'),
      });
    });

    it('should throw error if category does not exist', async () => {
      (service.create as jest.Mock).mockRejectedValueOnce({
        status: 400,
        message: 'Category with ID catX does not exist',
      });
      const dto: CreateProductDto = {
        name: 'Test', sku: 'SKU1', price: 100, stock: 10, categoryId: 'catX',
      };
      await expect(controller.create(dto)).rejects.toMatchObject({
        status: 400,
        message: expect.stringContaining('Category with ID catX does not exist'),
      });
    });
  });

  describe('findAll', () => {
    it('should return products and meta', async () => {
      const query = {};
      const result = await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(ResponseUtil.success).toHaveBeenCalledWith(productListMock, metaMock);
      expect(result).toEqual({ data: productListMock, meta: metaMock, success: true });
    });
  });

  describe('search', () => {
    it('should return products and meta for sku filter (multiple)', async () => {
      const query = { sku: ['1', '2', '3'] };
      const result = await controller.search(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(ResponseUtil.success).toHaveBeenCalledWith(productListMock, metaMock);
      expect(result).toEqual({ data: productListMock, meta: metaMock, success: true });
    });

    it('should return products and meta for name filter (multiple, LIKE)', async () => {
      const query = { name: ['a', 'b', 'c'] };
      const result = await controller.search(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(ResponseUtil.success).toHaveBeenCalledWith(productListMock, metaMock);
      expect(result).toEqual({ data: productListMock, meta: metaMock, success: true });
    });

    it('should return products and meta for price range', async () => {
      const query = { 'price.start': 100, 'price.end': 1000 };
      const result = await controller.search(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(ResponseUtil.success).toHaveBeenCalledWith(productListMock, metaMock);
      expect(result).toEqual({ data: productListMock, meta: metaMock, success: true });
    });

    it('should return products and meta for stock range', async () => {
      const query = { 'stock.start': 5, 'stock.end': 20 };
      const result = await controller.search(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(ResponseUtil.success).toHaveBeenCalledWith(productListMock, metaMock);
      expect(result).toEqual({ data: productListMock, meta: metaMock, success: true });
    });

    it('should return products and meta for category.id filter (multiple)', async () => {
      const query = { 'category.id': ['1', '2', '3'] };
      const result = await controller.search(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(ResponseUtil.success).toHaveBeenCalledWith(productListMock, metaMock);
      expect(result).toEqual({ data: productListMock, meta: metaMock, success: true });
    });

    it('should return products and meta for category.name filter (multiple)', async () => {
      const query = { 'category.name': ['catA', 'catB'] };
      const result = await controller.search(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(ResponseUtil.success).toHaveBeenCalledWith(productListMock, metaMock);
      expect(result).toEqual({ data: productListMock, meta: metaMock, success: true });
    });
  });
});
