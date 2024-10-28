import { VegetableService } from "./vegetable.service";
export declare class VegetableController {
    private vegetableService;
    constructor(vegetableService: VegetableService);
    getAll({ page, order, search }: {
        page: any;
        order: any;
        search: any;
    }, temporaryCredentials: any): Promise<any>;
    addNewVegetable(formData: any, file: Express.Multer.File, temporaryCredentials: any): Promise<{
        message: string;
        filename: string;
        name: any;
    }>;
    myVegetable(payload: any): Promise<any>;
    sendWhatsAppMsg(payload: any): Promise<any>;
    sendWhatsAppMsgUsingTwilio(payload: any): Promise<any>;
    sendMail(payload: any): Promise<any>;
    deleteItem(id: number): Promise<any>;
}
