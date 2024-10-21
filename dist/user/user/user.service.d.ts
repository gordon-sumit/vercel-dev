import { UserModel } from "../../models/user.model";
export declare class UserService {
    private user;
    constructor(user: typeof UserModel);
    getUser(): Promise<UserModel[]>;
    login(email: any, pass: any): Promise<UserModel>;
    getUserById(id: any): Promise<UserModel>;
    createUser(userData: any): Promise<UserModel>;
}
