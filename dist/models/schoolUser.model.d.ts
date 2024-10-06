import { Model } from 'sequelize-typescript';
import { UserModel } from "./user.model";
export declare class SchoolUserModel extends Model {
    id: number;
    user_id: number;
    school_id: number;
    user: UserModel;
}
