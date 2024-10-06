import {BelongsTo, Column, ForeignKey, Model, Table, DataType, HasMany} from 'sequelize-typescript';
import {UserModel} from "./user.model";
import {SchoolModel} from "./school.model";
import {UserTeams} from "./userTeam.model";

@Table({modelName: 'teams'})
export class Teams extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @Column
    team_name: string

    @ForeignKey(() => SchoolModel)
    @Column
    school_id: number;

    @Column
    sport_id: number;

    @BelongsTo(() => SchoolModel)
    school: SchoolModel

    @HasMany(() => UserTeams)
    userTeams: UserTeams

}