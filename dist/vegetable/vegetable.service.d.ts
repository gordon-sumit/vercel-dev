import { VegetableModel } from "../models/vegetable.model";
export declare class VegetableService {
    private vegetableModel;
    constructor(vegetableModel: typeof VegetableModel);
    getAll(page: any, search?: any): Promise<any>;
    addNewVeg(data: any): Promise<any>;
}
