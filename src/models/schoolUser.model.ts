import {BelongsTo, Column, ForeignKey, Model, Table, DataType} from 'sequelize-typescript';
import {UserModel} from "./user.model";

@Table({modelName:'school_users'})
export class SchoolUserModel extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    id: number;

    @ForeignKey(() => UserModel)
    @Column
    user_id: number;

    @Column
    school_id: number;

    // @HasOne(() => UserModel)
    // user: UserModel[];

    @BelongsTo(() => UserModel)
    user: UserModel

}