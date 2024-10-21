import { UserService } from "./user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUser(): Promise<import("../../models/user.model").UserModel[]>;
    getUserById(params: any): any;
    createUser(abc: any): Promise<void>;
    login({ email, password }: {
        email: any;
        password: any;
    }): Promise<{}>;
}
