
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ResponseUtil } from '../../common/utils/response.util';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { ConfigService } from '@nestjs/config';

const categoryMock = {
  id: '1',
  name: 'Category 1',
  products: [],
};
const categoryListMock = [categoryMock];
const metaMock = { current: 1, size: 10, total: 1 };

jest.mock('../../common/utils/response.util', () => ({
  ResponseUtil: {
    success: jest.fn((data, meta?) => ({ data, meta, success: true })),
  },
}));

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn().mockResolvedValue(categoryMock),
      findAll: jest.fn().mockResolvedValue({ categories: categoryListMock, meta: metaMock }),
      findOne: jest.fn().mockResolvedValue(categoryMock),
    };
    const apiKeyGuardMock = { canActivate: jest.fn().mockReturnValue(true) };
    const configServiceMock = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        { provide: CategoryService, useValue: serviceMock },
        { provide: ApiKeyGuard, useValue: apiKeyGuardMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).overrideGuard(ApiKeyGuard).useValue(apiKeyGuardMock).compile();
    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create category and return success', async () => {
      const dto = { name: 'Category 1' };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(ResponseUtil.success).toHaveBeenCalledWith(categoryMock);
      expect(result).toEqual({ data: categoryMock, success: true });
    });
    it('should throw validation error if required fields are missing', async () => {
      (service.create as jest.Mock).mockRejectedValueOnce({
        status: 400,
        message: 'Validation failed: name is required',
      });
      const dto = { name: '' };
      await expect(controller.create(dto)).rejects.toMatchObject({
        status: 400,
        message: expect.stringContaining('name is required'),
      });
    });
  });

  describe('findAll', () => {
    it('should return categories and meta', async () => {
      const query = { page: 1, limit: 10 };
      const result = await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(ResponseUtil.success).toHaveBeenCalledWith(categoryListMock, metaMock);
      expect(result).toEqual({ data: categoryListMock, meta: metaMock, success: true });
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(ResponseUtil.success).toHaveBeenCalledWith(categoryMock);
      expect(result).toEqual({ data: categoryMock, success: true });
    });
    it('should throw not found error', async () => {
      (service.findOne as jest.Mock).mockRejectedValueOnce({
        status: 404,
        message: 'Category not found',
      });
      await expect(controller.findOne('2')).rejects.toMatchObject({
        status: 404,
        message: expect.stringContaining('not found'),
      });
    });
  });
});
