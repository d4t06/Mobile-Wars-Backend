import { Category } from '@/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Description } from '@/description/entities/description.entity';
import { ProductAttribute } from '@/product-attribute/entities/product-attribute.entity';
import { Brand } from '@/brand/entities/brand.entity';
import { Comment } from '@/comment/entities/comment.entity';
import { ProductTag } from '@/product-tag/entities/product-tag.entity';
import { ProductFeature } from '@/product-feature/entities/product-feature.entity';

@Entity({ name: 'Products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_name: string;

  @Column({ unique: true })
  product_name_ascii: string;

  @Column({ nullable: true })
  image_url: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // created_at: string;

  // ***
  @Column()
  category_id: number;
  @ManyToOne(() => Category, (c) => c.id, {
    onDelete: 'CASCADE',
  })

  // this is the fk column name
  // must matches column name above
  @JoinColumn({ name: 'category_id' })
  // this is the alias column name
  category: Category;

  // ***
  @Column({ nullable: true })
  brand_id: number;
  @ManyToOne(() => Brand, (c) => c.id, {
    onDelete: 'SET NULL',
  })

  // this is the fk column name
  // must matches column name above
  @JoinColumn({ name: 'brand_id' })
  // this is the alias column names
  brand: Brand;

  // ***
  @OneToMany(
    () => ProductAttribute,
    (productAttribute) => productAttribute.product,
  )
  attributes: ProductAttribute[];

  // ***
  @OneToMany(() => Comment, (c) => c.product)
  comments: Comment[];

  // ***
  @OneToMany(() => ProductTag, (p) => p.product)
  product_tags: ProductTag[];

  // ***
  @OneToMany(() => ProductFeature, (p) => p.product)
  features: ProductFeature[];

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Description, (description) => description.product)
  description: Description;

  constructor(product: Partial<Product>) {
    Object.assign(this, product);
  }
}
