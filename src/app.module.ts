import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import * as process from "process";
import mysql2 from 'mysql2';
import { Dialect } from 'sequelize';
import {VegetableModule} from "./vegetable/vegetable.module";
import {VegetableModel} from "./models/vegetable.model";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forFeature([]),
    SequelizeModule.forRoot({
      dialect: process.env.DIALECT as Dialect,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABSE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      dialectModule:mysql2,
      models: [VegetableModel],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController,VegetableModule],
  providers: [AppService],
})
export class AppModule {}
