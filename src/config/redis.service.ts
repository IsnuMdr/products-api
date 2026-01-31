import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private publisher: Redis;
  private subscriber: Redis;

  constructor(private configService: ConfigService) { }

  async onModuleInit() {

    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in configuration');
    }

    this.publisher = new Redis(redisUrl, {
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    });

    this.subscriber = new Redis(redisUrl, {
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    });

    try {
      await Promise.all([
        new Promise((resolve, reject) => {
          this.publisher.on('connect', resolve);
          this.publisher.on('error', reject);
        }),
        new Promise((resolve, reject) => {
          this.subscriber.on('connect', resolve);
          this.subscriber.on('error', reject);
        }),
      ]);

      this.logger.log('✅ Redis connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to Redis', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await Promise.all([
      this.publisher?.quit(),
      this.subscriber?.quit(),
    ]);
    this.logger.log('Redis disconnected');
  }

  async publish(channel: string, message: any): Promise<void> {
    try {
      await this.publisher.publish(channel, JSON.stringify(message));
      this.logger.debug(`Published to ${channel}: ${JSON.stringify(message)}`);
    } catch (error) {
      this.logger.error(`Failed to publish to ${channel}`, error);
      throw error;
    }
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    await this.subscriber.subscribe(channel);

    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
          this.logger.debug(`Received from ${channel}: ${message}`);
        } catch (error) {
          this.logger.error(`Failed to parse message from ${channel}`, error);
        }
      }
    });
  }

  getPublisher(): Redis {
    return this.publisher;
  }

  getSubscriber(): Redis {
    return this.subscriber;
  }
}