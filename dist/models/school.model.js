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
exports.SchoolModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const team_model_1 = require("./team.model");
let SchoolModel = class SchoolModel extends sequelize_typescript_1.Model {
};
exports.SchoolModel = SchoolModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], SchoolModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SchoolModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SchoolModel.prototype, "address", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SchoolModel.prototype, "phone", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SchoolModel.prototype, "is_paid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: true }),
    __metadata("design:type", Boolean)
], SchoolModel.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => team_model_1.Teams),
    __metadata("design:type", Array)
], SchoolModel.prototype, "teams", void 0);
exports.SchoolModel = SchoolModel = __decorate([
    (0, sequelize_typescript_1.Table)({ modelName: 'schools' })
], SchoolModel);
//# sourceMappingURL=school.model.js.map