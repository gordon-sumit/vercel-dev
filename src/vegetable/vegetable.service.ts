import {Injectable} from '@nestjs/common';
import {VegetableModel} from "../models/vegetable.model";
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";

@Injectable()
export class VegetableService {
    constructor(@InjectModel(VegetableModel) private vegetableModel: typeof VegetableModel) {
    }

    async getAll(page, search = null): Promise<any> {
        const pageSize = 3;
        const offset = (page - 1) * pageSize;
        return await this.vegetableModel.findAndCountAll({
            limit: pageSize, offset: offset,
            where: search ? {
                keywords: {[Op.substring]: search}
            } : {},
        });
    }

    async addNewVeg(data): Promise<any> {
        return await this.vegetableModel.create(data);
    }

}
