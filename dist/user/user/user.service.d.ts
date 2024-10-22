import { UserModel } from "../../models/user.model";
import { JwtService } from "@nestjs/jwt";
export declare class UserService {
    private user;
    private jwtService;
    constructor(user: typeof UserModel, jwtService: JwtService);
    getUser(): Promise<UserModel[]>;
    login(email: any, pass: any): Promise<UserModel>;
    getUserById(id: any): Promise<UserModel>;
    createUser(userData: any): Promise<any>;
}
