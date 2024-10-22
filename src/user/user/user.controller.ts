import {Controller, Get, Post, Body, HttpCode, Param, UnauthorizedException, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "../../auth/auth.guard";
import process from "process";
import {OAuth2Client} from "google-auth-library";

@Controller('user')
export class UserController {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    @Get()
    @UseGuards(AuthGuard)
    getUser() {
        return this.userService.getUser();
    }

    @Get(':id')
    getUserById(@Param() params: any): any {
        return this.userService.getUserById(params.id)
    }

    @Post()
    async createUser(@Body() formData) {
        console.log(formData)
        return await this.userService.createUser(formData)
    }

    @Post('/auth/login')
    async login(@Body() {email, password}) {
        const user = await this.userService.login(email, password)
        if (user) {
            const payload = {sub: user.id, username: user.email}
            return {access_token: await this.jwtService.signAsync(payload)}
        } else {
            throw new UnauthorizedException();
        }

    }

}
