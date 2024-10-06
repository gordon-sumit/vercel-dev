import { Model } from 'sequelize-typescript';
import { SchoolUserModel } from "./schoolUser.model";
import { UserTeams } from "./userTeam.model";
export declare class UserModel extends Model {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    role_id: number;
    registered: number;
    password: string;
    isActive: boolean;
    schoolUsers: SchoolUserModel[];
    userTeams: UserTeams[];
}
