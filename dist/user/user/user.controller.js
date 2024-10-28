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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_1 = require("@nestjs/jwt");
const auth_guard_1 = require("../../auth/auth.guard");
let UserController = class UserController {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    getUser() {
        return this.userService.getUser();
    }
    getUserById(params) {
        return this.userService.getUserById(params.id);
    }
    async createUser(formData) {
        return await this.userService.createUser(formData);
    }
    async confirmUser({ username, code }) {
        console.log(username, code, 'username, code');
        return await this.userService.userConfirmSignup(username, code);
    }
    async login({ email, password }) {
        try {
            const user = await this.userService.cognitoLogin(email, password);
            if (user) {
                return user;
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException(e.message);
        }
    }
    async confirm() {
        return await this.userService.adminConfirmSignUp();
    }
    async verifySoftwareToken(data) {
        return await this.userService.verifySoftwareToken(data);
    }
    async respondToAuthChallenge(data) {
        return await this.userService.respondToAuthChallenge(data);
    }
    async onDeleteUser(ids) {
        return await this.userService.deleteCognitoUser(ids);
    }
    async getAllMedia(temporaryCredentials) {
        return await this.userService.getS3Files(JSON.parse(temporaryCredentials));
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)('/get/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('/confirm-register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "confirmUser", null);
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/test/confirm'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)('auth/verifySoftwareToken'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifySoftwareToken", null);
__decorate([
    (0, common_1.Post)('auth/respondToAuthChallenge'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "respondToAuthChallenge", null);
__decorate([
    (0, common_1.Delete)('/delete-user'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "onDeleteUser", null);
__decorate([
    (0, common_1.Get)('/media'),
    __param(0, (0, common_1.Headers)('temporaryCredentials')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllMedia", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService, jwt_1.JwtService])
], UserController);
//# sourceMappingURL=user.controller.js.map