import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { CreateProductAttributeDto } from './dto/create.product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Controller('product-attributes')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async createAttribute(@Body() dto: CreateProductAttributeDto[]) {
    return await this.productAttributeService.createAttribute(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateAttribute(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductAttributeDto[],
  ) {
    return await this.productAttributeService.updateAttribute(dto, id);
  }
}
