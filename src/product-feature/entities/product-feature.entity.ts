import { Product } from '@/products/entities/product.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Product_Features' })
export class ProductFeature {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	product_id: number;
	@ManyToOne(() => Product, (p) => p.features, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'product_id' })
	product: Product;

	@Column()
	value: string;
}
