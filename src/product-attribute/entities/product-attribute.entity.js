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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAttribute = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("../../products/entities/product.entity");
const category_attribute_entity_1 = require("../../category-attribute/entities/category-attribute.entity");
let ProductAttribute = class ProductAttribute {
    constructor(item) {
        Object.assign(this, item);
    }
};
exports.ProductAttribute = ProductAttribute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductAttribute.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductAttribute.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (p) => p.id, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductAttribute.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductAttribute.prototype, "category_attribute_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_attribute_entity_1.CategoryAttribute, (cA) => cA.id, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'category_attribute_id' }),
    __metadata("design:type", String)
], ProductAttribute.prototype, "category_attribute", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ProductAttribute.prototype, "value", void 0);
exports.ProductAttribute = ProductAttribute = __decorate([
    (0, typeorm_1.Entity)({ name: 'Product_Attributes' }),
    (0, typeorm_1.Unique)('check_unique', ['category_attribute_id', 'product_id']),
    __metadata("design:paramtypes", [Object])
], ProductAttribute);
//# sourceMappingURL=product-attribute.entity.js.map