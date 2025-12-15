import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS for development
  app.enableCors();

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📄 Angular SSR is serving at: http://localhost:${port}`);
  logger.log(`🔗 API endpoints at: http://localhost:${port}/api`);
}

bootstrap();

