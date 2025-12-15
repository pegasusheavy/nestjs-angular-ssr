import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ProductsController } from './products/products.controller';
import { HealthController } from './health/health.controller';

@Module({
  controllers: [UsersController, ProductsController, HealthController],
})
export class ApiModule {}

