import {Column, HasMany, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {SchoolUserModel} from "./schoolUser.model";
import {Teams} from "./team.model";

@Table({modelName:'schools'})
export class SchoolModel extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    id: number

    @Column
    name: string;

    @Column
    address: string;

    @Column
    phone: string;

    @Column
    is_paid: number

    @Column({defaultValue: true})
    isActive: boolean;

    @HasMany(() => Teams)
    teams: Teams[];
}