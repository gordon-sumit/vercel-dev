import { VegetableModel } from "../models/vegetable.model";
export declare class VegetableService {
    private vegetableModel;
    private client;
    private transporter;
    private readonly bucket;
    constructor(vegetableModel: typeof VegetableModel);
    getAll(page: any, order: any, search: any, tempCredentials: any): Promise<any>;
    addNewVeg(data: any, file: any, key: any, tempCredentials: any): Promise<any>;
    removeItem(id: any): Promise<any>;
    sendWhatsAppMessage(to: string, message: string): Promise<any>;
    mail(message: any): Promise<any>;
}
