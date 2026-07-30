import { Repository } from 'typeorm';
import { ProductAttribute } from './entities/product-attribute.entity';
import { CreateProductAttributeDto } from './dto/create.product-attribute.dto';
export declare class ProductAttributeService {
    private readonly productAttributeRepository;
    constructor(productAttributeRepository: Repository<ProductAttribute>);
    createAttribute(dtos: CreateProductAttributeDto[]): Promise<import("typeorm").InsertResult>;
    updateAttribute(dtos: CreateProductAttributeDto[], id: number): Promise<void>;
}
