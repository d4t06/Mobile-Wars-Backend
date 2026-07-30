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
exports.ProductAttributeController = void 0;
const common_1 = require("@nestjs/common");
const product_attribute_service_1 = require("./product-attribute.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
let ProductAttributeController = class ProductAttributeController {
    constructor(productAttributeService) {
        this.productAttributeService = productAttributeService;
    }
    async createAttribute(dto) {
        return await this.productAttributeService.createAttribute(dto);
    }
    async updateAttribute(id, dto) {
        return await this.productAttributeService.updateAttribute(dto, id);
    }
};
exports.ProductAttributeController = ProductAttributeController;
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "createAttribute", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "updateAttribute", null);
exports.ProductAttributeController = ProductAttributeController = __decorate([
    (0, common_1.Controller)('product-attributes'),
    __metadata("design:paramtypes", [product_attribute_service_1.ProductAttributeService])
], ProductAttributeController);
//# sourceMappingURL=product-attribute.controller.js.map