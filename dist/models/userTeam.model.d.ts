import { Model } from 'sequelize-typescript';
import { UserModel } from "./user.model";
import { Teams } from "./team.model";
export declare class UserTeams extends Model {
    id: number;
    team_id: number;
    user_id: number;
    school_id: number;
    sport_id: number;
    team: Teams;
    user: UserModel;
}
