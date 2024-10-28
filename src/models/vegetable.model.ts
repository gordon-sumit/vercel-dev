import {Column, DeletedAt, Model, Table} from "sequelize-typescript";

@Table({modelName: 'vegetables'})
export class VegetableModel extends Model {
    @Column({primaryKey:true,autoIncrement: true})
    id:number

    @Column
    name:string

    @Column
    key:string

    @Column
    initial_qty:number

    @Column
    thumbnail:string

    @Column
    keywords:string

    @DeletedAt
    deletedAt:Date
}
