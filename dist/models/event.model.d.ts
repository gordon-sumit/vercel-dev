import { Model } from "sequelize-typescript";
export declare class EventModel extends Model {
    id: number;
    title: string;
    description: string;
    room: string;
}
