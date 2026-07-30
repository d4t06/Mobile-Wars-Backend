import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto } from './dto/create.product-attribute.dto';
export declare class ProductAttributeController {
    private readonly productAttributeService;
    constructor(productAttributeService: ProductAttributeService);
    createAttribute(dto: CreateProductAttributeDto[]): Promise<import("typeorm").InsertResult>;
    updateAttribute(id: number, dto: CreateProductAttributeDto[]): Promise<void>;
}
