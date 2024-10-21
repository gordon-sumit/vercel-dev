import { Module } from '@nestjs/common';
import {UserModel} from "../../models/user.model";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {SequelizeModule} from "@nestjs/sequelize";

@Module({
   imports:[SequelizeModule.forFeature([UserModel])],
   controllers:[UserController],
   providers:[UserService],
   exports: [UserService],
})
export class UserModule {}
