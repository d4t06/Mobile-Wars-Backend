"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const typeorm_2 = require("@nestjs/typeorm");
const description_entity_1 = require("../description/entities/description.entity");
const apphelper_1 = require("../utils/apphelper");
const product_tag_entity_1 = require("../product-tag/entities/product-tag.entity");
const user_like_product_entity_1 = require("../user-like-product/entities/user-like-product.entity");
const product_feature_entity_1 = require("../product-feature/entities/product-feature.entity");
let ProductsService = class ProductsService {
    constructor(productRepository, descriptionRepository, productTagRepository, userLikeProductRepository, productFeatureReposity, entityManager) {
        this.productRepository = productRepository;
        this.descriptionRepository = descriptionRepository;
        this.productTagRepository = productTagRepository;
        this.userLikeProductRepository = userLikeProductRepository;
        this.productFeatureReposity = productFeatureReposity;
        this.entityManager = entityManager;
        this.pageSize = +process.env.PAGE_SIZE || 6;
    }
    async findAll(page, category_id, brand_id, tag_id) {
        const where = {};
        const _page = page || 1;
        if (category_id && +category_id)
            where.category_id = +category_id;
        if (brand_id && brand_id.length)
            where.brand_id = (0, typeorm_1.In)(brand_id);
        let products = [];
        let count = 0;
        if (tag_id) {
            const productTags = await this.productTagRepository.findBy({
                tag_id: (0, typeorm_1.In)(tag_id),
                product: true,
            });
            if (productTags.length) {
                const tagByProductId = {};
                productTags.forEach((productTag) => {
                    if (tagByProductId[productTag.product_id]) {
                        tagByProductId[productTag.product_id].push(productTag.tag_id);
                    }
                    else
                        tagByProductId[productTag.product_id] = [productTag.tag_id];
                });
                const checkProductMeetAllTag = (productTagIds) => {
                    if (productTagIds.length !== tag_id.length)
                        return false;
                    for (const id of productTagIds) {
                        if (!tag_id.includes(id + '')) {
                            return false;
                        }
                    }
                    return true;
                };
                const productIds = [];
                Object.entries(tagByProductId).forEach(([productId, tagIds]) => {
                    const isMeetAllTags = checkProductMeetAllTag(tagIds);
                    if (isMeetAllTags)
                        productIds.push(+productId);
                });
                if (productIds.length) {
                    const res = await this.productRepository.findAndCount({
                        take: this.pageSize,
                        skip: (_page - 1) * this.pageSize,
                        where: { brand_id: where.brand_id, id: (0, typeorm_1.In)(productIds) },
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
        }
        else {
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
    async findAllOfTag(page, tag_id) {
        const where = {};
        const _page = page || 1;
        if (tag_id && +tag_id)
            where.tag_id = +tag_id;
        else
            throw new common_1.BadRequestException();
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
    async findOne(productId) {
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
        if (!product)
            throw new common_1.NotFoundException('product not found');
        return product;
    }
    async search(q) {
        const products = await this.productRepository.find({
            where: {
                product_name_ascii: (0, typeorm_1.Like)(`%${(0, apphelper_1.generateId)(q)}%`),
            },
            relations: {
                product_tags: {
                    tag: true,
                },
                features: true,
            },
        });
        if (products.length)
            return products;
        return [];
    }
    async create(createProductDto) {
        const foundedProduct = await this.productRepository.findOne({
            where: { product_name_ascii: createProductDto.product_name_ascii },
        });
        if (foundedProduct)
            throw new common_1.ConflictException('Product name had taken');
        const item = new product_entity_1.Product(createProductDto);
        const newProduct = await this.entityManager.save(item);
        const description = new description_entity_1.Description({
            content: newProduct.product_name,
            product_id: newProduct.id,
        });
        await this.descriptionRepository.save(description);
        const fullNewProduct = await this.findOne(newProduct.id);
        return fullNewProduct;
    }
    async update(updateDto, id) {
        await this.productRepository.update(id, updateDto);
        return 'ok';
    }
    async addTag(data) {
        return await this.productTagRepository.save(data);
    }
    async removeTag(data) {
        this.productTagRepository.delete(data);
        return 'ok';
    }
    async likeProduct(data) {
        await this.userLikeProductRepository.save(data);
        return 'ok';
    }
    async unlikeProduct(data) {
        await this.userLikeProductRepository.delete(data);
        return 'ok';
    }
    async delete(id) {
        const product = await this.productRepository.findOne({
            where: { id },
        });
        if (!product)
            throw new common_1.NotFoundException('product not found');
        await this.productRepository.delete({ id });
        return 'ok';
    }
    async getLikeProduct(user_id) {
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
    async addFeature(data) {
        return await this.productFeatureReposity.save(data);
    }
    async editFeature(data, id) {
        await this.productFeatureReposity.update(id, data);
        return 'ok';
    }
    async removeFeature(id) {
        this.productFeatureReposity.delete(id);
        return 'ok';
    }
    async test() {
        return 'ok';
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_2.InjectRepository)(description_entity_1.Description)),
    __param(2, (0, typeorm_2.InjectRepository)(product_tag_entity_1.ProductTag)),
    __param(3, (0, typeorm_2.InjectRepository)(user_like_product_entity_1.UserLikeProduct)),
    __param(4, (0, typeorm_2.InjectRepository)(product_feature_entity_1.ProductFeature)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.EntityManager])
], ProductsService);
//# sourceMappingURL=products.service.js.map