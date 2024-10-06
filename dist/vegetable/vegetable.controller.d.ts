import { VegetableService } from "./vegetable.service";
export declare class VegetableController {
    private vegetableService;
    constructor(vegetableService: VegetableService);
    getAll({ page, search }: {
        page: any;
        search: any;
    }): Promise<any>;
    myVegetable(payload: any): Promise<any>;
}
