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
exports.VegetableService = void 0;
const common_1 = require("@nestjs/common");
const vegetable_model_1 = require("../models/vegetable.model");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
let VegetableService = class VegetableService {
    constructor(vegetableModel) {
        this.vegetableModel = vegetableModel;
    }
    async getAll(page, search = null) {
        const pageSize = 3;
        const offset = (page - 1) * pageSize;
        return await this.vegetableModel.findAndCountAll({
            limit: pageSize, offset: offset,
            where: search ? {
                keywords: { [sequelize_2.Op.substring]: search }
            } : {},
        });
    }
    async addNewVeg(data) {
        return await this.vegetableModel.create(data);
    }
};
exports.VegetableService = VegetableService;
exports.VegetableService = VegetableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(vegetable_model_1.VegetableModel)),
    __metadata("design:paramtypes", [Object])
], VegetableService);
//# sourceMappingURL=vegetable.service.js.map