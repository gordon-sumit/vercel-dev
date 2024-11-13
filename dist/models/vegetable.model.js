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
exports.VegetableModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let VegetableModel = class VegetableModel extends sequelize_typescript_1.Model {
};
exports.VegetableModel = VegetableModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], VegetableModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], VegetableModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], VegetableModel.prototype, "key", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], VegetableModel.prototype, "initial_qty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], VegetableModel.prototype, "thumbnail", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], VegetableModel.prototype, "keywords", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Date)
], VegetableModel.prototype, "deletedAt", void 0);
exports.VegetableModel = VegetableModel = __decorate([
    (0, sequelize_typescript_1.Table)({ modelName: 'vegetables' })
], VegetableModel);
//# sourceMappingURL=vegetable.model.js.map