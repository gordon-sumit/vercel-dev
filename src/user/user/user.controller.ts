import {Controller, Get, Post, Body, HttpCode, Param} from '@nestjs/common';
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Get()
    getUser() {
        return this.userService.getUser();
    }

    @Get(':id')
    getUserById(@Param() params: any): any {
        return this.userService.getUserById(params.id)
    }

    @Post()
    @HttpCode(206)
    createUser(@Body() abc) {
        console.log(abc)
        return this.userService.createUser(abc)
            .then((res) => console.log(res))
            .catch(e => console.log(e))
    }

    @Post('/auth/login')
    @HttpCode(202)
    async login(@Body() {email, password}) {
        let response = {};
        const user = await this.userService.login(email, password)
            .then((res) => response = res)
            .catch(e => response = {error: 'error'});
        return user ? response : {error: 'error'};
    }

}
