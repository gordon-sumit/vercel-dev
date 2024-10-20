import { VegetableModel } from "../models/vegetable.model";
export declare class VegetableService {
    private vegetableModel;
    private client;
    private transporter;
    constructor(vegetableModel: typeof VegetableModel);
    getAll(page: any, order: any, search?: any): Promise<any>;
    addNewVeg(data: any): Promise<any>;
    removeItem(id: any): Promise<any>;
    sendWhatsAppMessage(to: string, message: string): Promise<any>;
    mail(message: any): Promise<any>;
}
