import {Column, Model, Table} from "sequelize-typescript";

@Table({modelName:'sports'})
export class Sports extends Model{
    @Column({primaryKey: true, autoIncrement: true})
    id: number

    @Column
    name:string

    @Column
    order:number
}