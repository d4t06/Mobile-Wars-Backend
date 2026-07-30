import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductAttribute } from './entities/product-attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductAttributeDto } from './dto/create.product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private readonly productAttributeRepository: Repository<ProductAttribute>,
  ) {}

  async createAttribute(dtos: CreateProductAttributeDto[]) {
    const attributes = await this.productAttributeRepository.upsert(dtos, ['id']);
    return attributes;
  }

  async updateAttribute(dtos: CreateProductAttributeDto[], id: number) {
    await this.productAttributeRepository.upsert(dtos, ['id']);
  }
}
