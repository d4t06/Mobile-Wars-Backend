import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): string {
    return this.categoriesService.findAll();
  }

  @Post()
  create(@Body() createDto: CreateCategoryDto) {
    return this.categoriesService.create(createDto);
  }
}