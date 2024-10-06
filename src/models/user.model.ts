import {Column, HasMany, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {SchoolUserModel} from "./schoolUser.model";
import {UserTeams} from "./userTeam.model";

@Table({modelName: 'Users'})
export class UserModel extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    id: number

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    email: string;

    @Column
    address: string;

    @Column
    phone: string;

    @Column
    role_id: number

    @Column
    registered: number

    @Column
    password: string

    @Column({defaultValue: true})
    isActive: boolean;

    @HasMany(() => SchoolUserModel)
    schoolUsers: SchoolUserModel[];

    @HasMany(() => UserTeams)
    userTeams: UserTeams[];
}