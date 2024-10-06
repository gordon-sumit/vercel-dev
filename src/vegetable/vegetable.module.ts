import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {VegetableModel} from "../models/vegetable.model";
import {VegetableService} from "./vegetable.service";
import {VegetableController} from "./vegetable.controller";

@Module({
    imports: [
        SequelizeModule.forFeature([VegetableModel]),
    ],
    controllers: [VegetableController],
    providers: [VegetableService],
    exports: [VegetableService]
})
export class VegetableModule {

}
