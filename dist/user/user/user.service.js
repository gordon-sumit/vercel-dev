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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("../../models/user.model");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(user, jwtService) {
        this.user = user;
        this.jwtService = jwtService;
    }
    async getUser() {
        return this.user.findAll({ include: 'schoolUsers' });
    }
    async login(email, pass) {
        return this.user.findOne({ where: [{ email: email, password: pass }] });
    }
    async getUserById(id) {
        return this.user.findOne({
            where: [{ id: id }],
            include: ['schoolUsers', 'userTeams']
        });
    }
    async createUser(userData) {
        const isUserExist = await this.user.findOne({
            where: [{ email: userData.email }]
        });
        if (!isUserExist) {
            return this.user.create(userData);
        }
        else {
            const payload = { sub: isUserExist.id, username: isUserExist.email };
            const token = await this.jwtService.signAsync(payload);
            return { access_token: token };
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.UserModel)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map