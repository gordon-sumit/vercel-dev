import { VegetableService } from "./vegetable.service";
export declare class VegetableController {
    private vegetableService;
    constructor(vegetableService: VegetableService);
    getAll({ page, order, search }: {
        page: any;
        order: any;
        search: any;
    }): Promise<any>;
    addNewVegetable(formData: any, file: Express.Multer.File): Promise<{
        message: string;
        filename: string;
        name: any;
    }>;
    myVegetable(payload: any): Promise<any>;
    deleteItem(id: number): Promise<any>;
}
