import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/config/redis.service';
import { ProductQueryRepository } from '../repositories/product-query.repository';

@Injectable()
export class ProductSyncHandler implements OnModuleInit {
  private readonly logger = new Logger(ProductSyncHandler.name);

  constructor(
    private redisService: RedisService,
    private productQueryRepository: ProductQueryRepository,
  ) { }

  async onModuleInit() {
    // Subscribe to product events
    await this.redisService.subscribe('product.created', this.handleProductCreated.bind(this));
    await this.redisService.subscribe('product.updated', this.handleProductUpdated.bind(this));
    await this.redisService.subscribe('product.deleted', this.handleProductDeleted.bind(this));

    this.logger.log('✅ Product sync handler initialized');
  }

  private async handleProductCreated(data: any) {
    try {
      await this.productQueryRepository.upsertFromSync(data);
      this.logger.log(`✅ Synced product created: ${data.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to sync product created: ${data.id}`, error);
    }
  }

  private async handleProductUpdated(data: any) {
    try {
      await this.productQueryRepository.upsertFromSync(data);
      this.logger.log(`✅ Synced product updated: ${data.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to sync product updated: ${data.id}`, error);
    }
  }

  private async handleProductDeleted(data: any) {
    try {
      await this.productQueryRepository.deleteFromSync(data.productId);
      this.logger.log(`✅ Synced product deleted: ${data.productId}`);
    } catch (error) {
      this.logger.error(`❌ Failed to sync product deleted: ${data.productId}`, error);
    }
  }
}