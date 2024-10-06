import {Column, Model, Table} from "sequelize-typescript";

@Table({modelName:'Events'})
export class EventModel extends Model{
    @Column({primaryKey: true, autoIncrement: true})
    id:number

    @Column
    title:string

    @Column
    description:string

    @Column
    room:string

}