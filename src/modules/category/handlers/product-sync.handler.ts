import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/config/redis.service';
import { CategoryQueryRepository } from '../repositories/category-query.repository';

@Injectable()
export class CategorySyncHandler implements OnModuleInit {
  private readonly logger = new Logger(CategorySyncHandler.name);

  constructor(
    private redisService: RedisService,
    private categoryQueryRepository: CategoryQueryRepository,
  ) { }

  async onModuleInit() {
    // Subscribe to category events
    await this.redisService.subscribe('category.created', this.handleCategoryCreated.bind(this));
    await this.redisService.subscribe('category.updated', this.handleCategoryUpdated.bind(this));
    await this.redisService.subscribe('category.deleted', this.handleCategoryDeleted.bind(this));

    this.logger.log('✅ Category sync handler initialized');
  }

  private async handleCategoryCreated(data: any) {
    try {
      await this.categoryQueryRepository.upsertFromSync(data);
      this.logger.log(`✅ Synced category created: ${data.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to sync category created: ${data.id}`, error);
    }
  }

  private async handleCategoryUpdated(data: any) {
    try {
      await this.categoryQueryRepository.upsertFromSync(data);
      this.logger.log(`✅ Synced category updated: ${data.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to sync category updated: ${data.id}`, error);
    }
  }

  private async handleCategoryDeleted(data: any) {
    try {
      await this.categoryQueryRepository.deleteFromSync(data.id);
      this.logger.log(`✅ Synced category deleted: ${data.id}`);
    } catch (error) {
      this.logger.error(`❌ Failed to sync category deleted: ${data.id}`, error);
    }
  }
}