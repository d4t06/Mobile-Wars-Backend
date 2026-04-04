import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { Product } from './entities/product.entity';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/decorators/role.enum';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CreateProductTagDto } from '@/product-tag/dto/create-product-tag.dto';
import { CreateUserLikeProductDto } from '@/user-like-product/dto/create-user-like-product.dto';
import { CreateProductFeatureDto } from '@/product-feature/dto/create-product-feature.dto';
import { UpdateProductFeature } from '@/product-feature/dto/update-product-feature.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get('/test')
  async test() {
    await this.productService.test();
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe)
    page: number,
    @Query('category_id', new ParseIntPipe({ optional: true }))
    category_id: number,
    @Query('brand_id', new ParseArrayPipe({ optional: true }))
    brand_id: string[],
    @Query('tag_id', new ParseArrayPipe({ optional: true }))
    tag_id: string[],
  ) {
    return this.productService.findAll(page, category_id, brand_id, tag_id);
  }

  @Get('/tags/:tag_id')
  findAllOfTag(
    @Query('page', new ParseIntPipe({ optional: true }))
    page: number,
    @Param('tag_id', new ParseIntPipe({ optional: true }))
    tag_id: number,
  ) {
    return this.productService.findAllOfTag(page, tag_id);
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.productService.search(q);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() product: CreateProductDto) {
    const newProduct = await this.productService.create(product);
    return newProduct;
  }

  @Post('/tags')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async addTag(@Body() productTags: CreateProductTagDto[]) {
    return await this.productService.addTag(productTags);
  }

  @Delete(':product_id/tags/:tag_id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async removeTag(
    @Param('product_id', ParseIntPipe) product_id: number,
    @Param('tag_id', ParseIntPipe) tag_id: number,
  ) {
    return await this.productService.removeTag({
      tag_id,
      product_id,
    });
  }

  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Body() updateDto: UpdateProductDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const newProduct = await this.productService.update(updateDto, id);
    return newProduct;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.productService.delete(id);
  }

  @Get('/likes/:user_id')
  @UseGuards(AuthGuard)
  async getLikeProduct(
    @Req() request: Request & { user: { id: number } },
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    if (request.user.id !== user_id) throw new BadRequestException();

    return await this.productService.getLikeProduct(user_id);
  }

  @Post('/likes')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async likeProduct(
    @Req() request: Request & { user: { id: number } },
    @Body() data: CreateUserLikeProductDto,
  ) {
    if (request.user.id !== data.user_id) throw new BadRequestException();

    await this.productService.likeProduct(data);
  }

  @Delete(':product_id/likes/:user_id')
  @UseGuards(AuthGuard)
  async unLikeProduct(
    @Req() request: Request & { user: { id: number } },
    @Param('product_id', ParseIntPipe) product_id: number,
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    if (request.user.id !== user_id) throw new BadRequestException();

    return await this.productService.unlikeProduct({
      user_id,
      product_id,
    });
  }

  @Post('/features')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async addProductFeature(@Body() data: CreateProductFeatureDto) {
    await this.productService.addFeature(data);
  }

  @Put('/features/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async editProductFeature(
    @Body() data: UpdateProductFeature,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.productService.editFeature(data, id);
  }

  @Delete('/features/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async deleteProductFeature(@Param('id', ParseIntPipe) id: number) {
    await this.productService.removeFeature(id);
  }
}
