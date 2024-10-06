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
exports.UserTeams = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const team_model_1 = require("./team.model");
let UserTeams = class UserTeams extends sequelize_typescript_1.Model {
};
exports.UserTeams = UserTeams;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], UserTeams.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => team_model_1.Teams),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserTeams.prototype, "team_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UserModel),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserTeams.prototype, "user_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserTeams.prototype, "school_id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserTeams.prototype, "sport_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => team_model_1.Teams),
    __metadata("design:type", team_model_1.Teams)
], UserTeams.prototype, "team", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UserModel),
    __metadata("design:type", user_model_1.UserModel)
], UserTeams.prototype, "user", void 0);
exports.UserTeams = UserTeams = __decorate([
    (0, sequelize_typescript_1.Table)({ modelName: 'user_teams' })
], UserTeams);
//# sourceMappingURL=userTeam.model.js.map