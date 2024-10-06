import {BelongsTo, Column, ForeignKey, Model, Table, DataType} from 'sequelize-typescript';
import {UserModel} from "./user.model";
import {SchoolModel} from "./school.model";
import {Teams} from "./team.model";

@Table({modelName:'user_teams'})
export class UserTeams extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @ForeignKey(() => Teams)
    @Column
    team_id:number

    @ForeignKey(() => UserModel)
    @Column
    user_id:number

    @Column
    school_id: number;

    @Column
    sport_id: number;

    @BelongsTo(() => Teams)
    team: Teams

    @BelongsTo(() => UserModel)
    user: UserModel

}