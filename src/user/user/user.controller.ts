import {
    Controller,
    Get,
    Post,
    Body,
    Request,
    Req,
    HttpCode,
    Headers,
    Param,
    UnauthorizedException,
    UseGuards,
    InternalServerErrorException, HttpException, HttpStatus, Delete
} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "../../auth/auth.guard";
import process from "process";
import {OAuth2Client} from "google-auth-library";
import {NotAuthorizedException} from "@aws-sdk/client-cognito-identity-provider";
import {jwtDecode} from "jwt-decode";
import {config, Credentials, S3} from "aws-sdk";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private jwtService: JwtService) {
    }

    @Get()
    @UseGuards(AuthGuard)
    getUser() {
        return this.userService.getUser();
    }

    @Get('/get/:id')
    getUserById(@Param() params: any): any {
        return this.userService.getUserById(params.id)
    }

    @Post()
    async createUser(@Body() formData) {
        return await this.userService.createUser(formData);
    }

    @Post('/confirm-register')
    async confirmUser(@Body() {username, code}) {
        console.log(username, code, 'username, code')
        return await this.userService.userConfirmSignup(username, code);
    }

    @Post('/login')
    async login(@Body() {email, password}) {
        try {
            const user = await this.userService.cognitoLogin(email, password)
            if (user) {
                return user;
            }
        } catch (e) {
            throw new UnauthorizedException(e.message);
        }
    }

    @Get('/test/confirm')
    async confirm() {
        return await this.userService.adminConfirmSignUp();
    }

    @Post('auth/verifySoftwareToken')
    async verifySoftwareToken(@Body() data) {
        return await this.userService.verifySoftwareToken(data);
    }

    @Post('auth/respondToAuthChallenge')
    async respondToAuthChallenge(@Body() data) {
        return await this.userService.respondToAuthChallenge(data);
    }


    @Delete('/delete-user')
    @UseGuards(AuthGuard)
    async onDeleteUser(@Body() ids) {
        return await this.userService.deleteCognitoUser(ids);
    }

    @Get('/media')
    async getAllMedia(@Headers('temporaryCredentials') temporaryCredentials){
        return await this.userService.getS3Files(JSON.parse(temporaryCredentials));
    }
}


