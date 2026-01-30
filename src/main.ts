import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.enableCors();

  app.setGlobalPrefix('api/');

  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/api/`);
  logger.log(`API Documentation: http://localhost:${port}/api/`);
}

bootstrap();