import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProductDto } from './dto/update.product.dto';
import { CreateProductDto } from './dto/create.product.dto';
import {
  EntityManager,
  FindOperator,
  FindOptionsWhere,
  In,
  Like,
  Repository,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Description } from '@/description/entities/description.entity';
import { generateId } from '@/utils/apphelper';
import { ProductTag } from '@/product-tag/entities/product-tag.entity';
import { CreateProductTagDto } from '@/product-tag/dto/create-product-tag.dto';
import { CreateUserLikeProductDto } from '@/user-like-product/dto/create-user-like-product.dto';
import { UserLikeProduct } from '@/user-like-product/entities/user-like-product.entity';
import { CreateProductFeatureDto } from '@/product-feature/dto/create-product-feature.dto';
import { ProductFeature } from '@/product-feature/entities/product-feature.entity';
import { UpdateProductFeature } from '@/product-feature/dto/update-product-feature.dto';
// import { STATUS_CODES } from 'http';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Description)
    private readonly descriptionRepository: Repository<Description>,

    @InjectRepository(ProductTag)
    private readonly productTagRepository: Repository<ProductTag>,

    @InjectRepository(UserLikeProduct)
    private readonly userLikeProductRepository: Repository<UserLikeProduct>,

    @InjectRepository(ProductFeature)
    private readonly productFeatureReposity: Repository<ProductFeature>,

    private readonly entityManager: EntityManager,
  ) {}

  public pageSize = +process.env.PAGE_SIZE || 6;

  async findAll(
    page: number,
    category_id: number,
    brand_id: string[],
    tag_id: string[],
  ) {
    const where: Record<string, number | FindOperator<any>> = {};

    const _page = page || 1;

    if (category_id && +category_id) where.category_id = +category_id;
    if (brand_id && brand_id.length) where.brand_id = In(brand_id);

    let products: Product[] = [];
    let count = 0;

    if (tag_id) {
      const productTags = await this.productTagRepository.findBy({
        tag_id: In(tag_id),
        product: true,
      });

      if (productTags.length) {
        const tagByProductId: Record<number, number[]> = {};

        productTags.forEach((productTag) => {
          if (tagByProductId[productTag.product_id]) {
            tagByProductId[productTag.product_id].push(productTag.tag_id);
          } else tagByProductId[productTag.product_id] = [productTag.tag_id];
        });

        const checkProductMeetAllTag = (productTagIds: number[]) => {
          if (productTagIds.length !== tag_id.length) return false;

          for (const id of productTagIds) {
            if (!tag_id.includes(id + '')) {
              return false;
            }
          }

          return true;
        };

        const productIds: number[] = [];

        Object.entries(tagByProductId).forEach(([productId, tagIds]) => {
          const isMeetAllTags = checkProductMeetAllTag(tagIds);
          if (isMeetAllTags) productIds.push(+productId);
        });

        if (productIds.length) {
          const res = await this.productRepository.findAndCount({
            take: this.pageSize,
            skip: (_page - 1) * this.pageSize,
            where: { brand_id: where.brand_id, id: In(productIds) },
            relations: {
              features: true,
              product_tags: {
                tag: true,
              },
            },
          });

          products = res[0];
          count = res[1];
        }
      }
    } else {
      const res = await this.productRepository.findAndCount({
        take: this.pageSize,
        skip: (_page - 1) * this.pageSize,
        order: {
          id: 'DESC',
        },
        where,
        relations: {
          features: true,
          product_tags: {
            tag: true,
          },
        },
      });

      products = res[0];
      count = res[1];
    }

    return {
      count,
      page: _page,
      category_id,
      brand_id,
      tag_id,
      page_size: this.pageSize,
      products,
    };
  }

  async findAllOfTag(page: number, tag_id: number) {
    const where: FindOptionsWhere<ProductTag> = {};

    const _page = page || 1;

    if (tag_id && +tag_id) where.tag_id = +tag_id;
    else throw new BadRequestException();

    const [productTags, count] = await this.productTagRepository.findAndCount({
      take: this.pageSize,
      skip: (_page - 1) * this.pageSize,
      where,
      relations: {
        product: {
          features: true,
          product_tags: {
            tag: true,
          },
        },
      },
    });

    return {
      count,
      page: _page,
      page_size: this.pageSize,
      products: productTags.map((pT) => pT.product),
    };
  }

  async findOne(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: {
        features: true,
        attributes: true,
        description: true,
        product_tags: {
          tag: true,
        },
      },
    });

    if (!product) throw new NotFoundException('product not found');

    return product;
  }

  async search(q: string) {
    const products = await this.productRepository.find({
      where: {
        product_name_ascii: Like(`%${generateId(q)}%`),
      },
      relations: {
        product_tags: {
          tag: true,
        },
        features: true,
      },
    });

    if (products.length) return products;
    return [];
  }

  async create(createProductDto: CreateProductDto) {
    const foundedProduct = await this.productRepository.findOne({
      where: { product_name_ascii: createProductDto.product_name_ascii },
    });

    if (foundedProduct) throw new ConflictException('Product name had taken');

    const item = new Product(createProductDto);
    const newProduct = await this.entityManager.save(item);

    // create description
    const description = new Description({
      content: newProduct.product_name,
      product_id: newProduct.id,
    });

    await this.descriptionRepository.save(description);


    const fullNewProduct = await this.findOne(newProduct.id);

    return fullNewProduct;
  }

  async update(updateDto: UpdateProductDto, id: number) {
    await this.productRepository.update(id, updateDto);
    return 'ok';
  }

  async addTag(data: CreateProductTagDto[]) {
    return await this.productTagRepository.save(data);
  }

  async removeTag(data: CreateProductTagDto) {
    this.productTagRepository.delete(data);
    return 'ok';
  }

  async likeProduct(data: CreateUserLikeProductDto) {
    await this.userLikeProductRepository.save(data);
    return 'ok';
  }

  async unlikeProduct(data: CreateUserLikeProductDto) {
    await this.userLikeProductRepository.delete(data);
    return 'ok';
  }

  async delete(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) throw new NotFoundException('product not found');

    await this.productRepository.delete({ id });
    return 'ok';
  }

  async getLikeProduct(user_id: number) {
    return await this.userLikeProductRepository.find({
      where: { user_id },
      relations: {
        product: {
          features: true,
          product_tags: {
            tag: true,
          },
        },
      },
    });
  }

  async addFeature(data: CreateProductFeatureDto) {
    return await this.productFeatureReposity.save(data);
  }

  async editFeature(data: UpdateProductFeature, id: number) {
    await this.productFeatureReposity.update(id, data);
    return 'ok';
  }

  async removeFeature(id: number) {
    this.productFeatureReposity.delete(id);
    return 'ok';
  }

  async test() {
  // const products = await this.productRepository.find({
//   where: { category_id: 6 },
//   relations: {
//     attributes: true,
//   },
// });

// let i = 0;

// for (; i < products.length; i++) {
//   const product = products[i];

//   const selectedAttr = product.attributes.filter((attr) =>
//     [4, 5].includes(attr.category_attribute_id),
//   );

//   if (selectedAttr.length) {
//     const value = selectedAttr.map((att) => att.value);

//     await this.productFeatureReposity.save({
//       product_id: product.id,
//       value: value.join(', '),
//     });
//   }
// }
    return 'ok';
  }
}
