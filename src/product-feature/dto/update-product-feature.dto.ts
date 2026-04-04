import { PartialType } from '@nestjs/mapped-types';
import { ProductFeature } from '../entities/product-feature.entity';

export class UpdateProductFeature extends PartialType(ProductFeature) {}
