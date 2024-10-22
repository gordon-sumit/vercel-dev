import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {jwtConstants} from './constants'; // Your secret JWT constants
import {Request} from 'express';
import {OAuth2Client} from 'google-auth-library';
import * as process from 'process';

@Injectable()
export class AuthGuard implements CanActivate {
    private googleOauthClient: OAuth2Client;

    constructor(private jwtService: JwtService) {
        // Initialize Google OAuth2 Client
        this.googleOauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            // Try verifying the token as a JWT
            // Attach payload to request object
            request['user'] = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret, // Ensure you have this constant set
            });
        } catch (jwtError) {
            // If JWT verification fails, try verifying as a Google ID token
            try {
                const googleTokenInfo = await this.googleOauthClient.getTokenInfo(token);
                if (!googleTokenInfo) {
                    throw new UnauthorizedException('Invalid Google token');
                }

                // Attach Google user info to request object
                request['user'] = googleTokenInfo;
            } catch (googleError) {
                throw new UnauthorizedException('Invalid token');
            }
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
