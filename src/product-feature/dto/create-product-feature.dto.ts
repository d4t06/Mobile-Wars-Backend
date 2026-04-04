import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductFeatureDto {
  @IsNotEmpty({ message: 'value is require' })
  value: string;

  @IsNotEmpty({ message: 'product_id is require' })
  @IsNumber()
  product_id: number;
}
