import { Model } from "sequelize-typescript";
export declare class VegetableModel extends Model {
    id: number;
    name: string;
    key: string;
    initial_qty: number;
    thumbnail: string;
    keywords: string;
    deletedAt: Date;
}
