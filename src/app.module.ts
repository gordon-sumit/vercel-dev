import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import * as process from "process";
import mysql2 from 'mysql2';
import {Dialect} from 'sequelize';
import {VegetableModule} from "./vegetable/vegetable.module";
import {VegetableModel} from "./models/vegetable.model";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';
import {UserModule} from "./user/user/user.module";
import {UserModel} from "./models/user.model";
import {SchoolUserModel} from "./models/schoolUser.model";
import {SchoolModel} from "./models/school.model";
import {Teams} from "./models/team.model";
import {UserTeams} from "./models/userTeam.model";
import {Sports} from "./models/sport.model";
//import {BullModule} from "@nestjs/bullmq";
//import {JobProcessor} from "./job-processor/job-processor";

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
            dialectModule: mysql2,
            models: [VegetableModel, UserModel, SchoolUserModel, SchoolModel, Teams, UserTeams, Sports],
            autoLoadModels: true,
            synchronize: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
            serveStaticOptions: {
                index: false,
            },
        }),
        UserModule,
        VegetableModule,
        // BullModule.forRoot({
        //   connection: {
        //     host: 'localhost',
        //     port: 6379,
        //   },
        // }),
        // BullModule.registerQueue({
        //   name: 'test', // Queue name
        // }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        //JobProcessor
    ],
})
export class AppModule {
}
