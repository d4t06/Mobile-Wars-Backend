import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryAttribute } from './entities/category-attribute.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryAttributeDto } from './dto/update.category-attribute.dto';
import { CreateCategoryAttributeDto } from './dto/create.category-attribute.dto';

@Injectable()
export class CategoryAttributeService {
  constructor(
    @InjectRepository(CategoryAttribute)
    private readonly categoryAttributeRepository: Repository<CategoryAttribute>,
  ) {}

  async create(categoryAttributeDto: CreateCategoryAttributeDto) {
    const categoryAttribute = new CategoryAttribute(categoryAttributeDto);
    return await this.categoryAttributeRepository.save(categoryAttribute);
  }

  async update(updateAttributeDto: UpdateCategoryAttributeDto, id: number) {
    await this.categoryAttributeRepository.update(id, updateAttributeDto);
  }

  async delete(id: number) {
    await this.categoryAttributeRepository.delete(id);
  }
}
