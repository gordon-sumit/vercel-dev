import { Model } from 'sequelize-typescript';
import { Teams } from "./team.model";
export declare class SchoolModel extends Model {
    id: number;
    name: string;
    address: string;
    phone: string;
    is_paid: number;
    isActive: boolean;
    teams: Teams[];
}
