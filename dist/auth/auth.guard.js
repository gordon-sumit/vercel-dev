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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const google_auth_library_1 = require("google-auth-library");
const process = require("process");
const aws_jwt_verify_1 = require("aws-jwt-verify");
let AuthGuard = class AuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.googleOauthClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        this.verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
            userPoolId: process.env.AWS_POOL_ID,
            clientId: process.env.AWS_COGNITO_CLIENT_ID,
            tokenUse: 'access',
        });
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            request['user'] = await this.verifier.verify(token);
        }
        catch (jwtError) {
            try {
                const googleTokenInfo = await this.googleOauthClient.getTokenInfo(token);
                if (!googleTokenInfo) {
                    throw new common_1.UnauthorizedException('Invalid Google token');
                }
                request['user'] = googleTokenInfo;
            }
            catch (googleError) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map