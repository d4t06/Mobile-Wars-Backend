import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Description } from '@/description/entities/description.entity';
import { ProductTag } from '@/product-tag/entities/product-tag.entity';
import { UserLikeProduct } from '@/user-like-product/entities/user-like-product.entity';
import { ProductFeature } from '@/product-feature/entities/product-feature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Description]),
    TypeOrmModule.forFeature([ProductTag]),
    TypeOrmModule.forFeature([UserLikeProduct]),
    TypeOrmModule.forFeature([ProductFeature]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
