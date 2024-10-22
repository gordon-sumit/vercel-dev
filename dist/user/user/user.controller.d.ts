import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
export declare class UserController {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    getUser(): Promise<import("../../models/user.model").UserModel[]>;
    getUserById(params: any): any;
    createUser(formData: any): Promise<any>;
    login({ email, password }: {
        email: any;
        password: any;
    }): Promise<{
        access_token: string;
    }>;
}
