import { Module } from '@nestjs/common';
import {UserModel} from "../../models/user.model";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {SchoolUserModel} from "../../models/schoolUser.model";
import {SchoolModel} from "../../models/school.model";
import {Teams} from "../../models/team.model";
import {UserTeams} from "../../models/userTeam.model";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "../../auth/constants";

@Module({
   imports:[
       SequelizeModule.forFeature([UserModel,SchoolUserModel, SchoolModel, Teams, UserTeams]),
      JwtModule.register({
         global: true,
         secret: jwtConstants.secret,
         signOptions: {expiresIn: '60s'},
      })
   ],
   controllers:[UserController],
   providers:[UserService],
   exports: [UserService],
})
export class UserModule {}
