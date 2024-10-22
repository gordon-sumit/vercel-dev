import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private googleOauthClient;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
