import { Model } from 'sequelize-typescript';
import { SchoolModel } from "./school.model";
import { UserTeams } from "./userTeam.model";
export declare class Teams extends Model {
    id: number;
    team_name: string;
    school_id: number;
    sport_id: number;
    school: SchoolModel;
    userTeams: UserTeams;
}
