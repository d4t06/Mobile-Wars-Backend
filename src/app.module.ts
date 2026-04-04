import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { ImagesModule } from './images/images.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { InitController } from './init/init.controller';
import { BrandModule } from './brand/brand.module';
import { DescriptionModule } from './description/description.module';
import { GreetingController } from './greeting/greeting.controller';
import { ProductAttributeModule } from './product-attribute/product-attribute.module';
import { CategoryAttributeModule } from './category-attribute/category-attribute.module';
import { CommentModule } from './comment/comment.module';
import { ImageModule } from './image/image.module';
import { UserLikeProductModule } from './user-like-product/user-like-product.module';
import { TagModule } from './tag/tag.module';
import { ProductTagModule } from './product-tag/product-tag.module';
import { ProductFeatureModule } from './product-feature/product-feature.module';

@Module({
  controllers: [AppController, InitController, GreetingController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        // time to live
        ttl: 10000,
        limit: 20,
      },
    ]),
    DatabaseModule,
    ProductsModule,
    CategoriesModule,
    ImagesModule,
    AuthModule,
    UsersModule,
    BrandModule,
    DescriptionModule,
    ProductAttributeModule,
    CategoryAttributeModule,
    CommentModule,
    ImageModule,
    UserLikeProductModule,
    TagModule,
    ProductTagModule,
    ProductFeatureModule,
  ],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
