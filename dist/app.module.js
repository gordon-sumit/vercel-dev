"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const process = require("process");
const mysql2_1 = require("mysql2");
const vegetable_module_1 = require("./vegetable/vegetable.module");
const vegetable_model_1 = require("./models/vegetable.model");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const user_module_1 = require("./user/user/user.module");
const user_model_1 = require("./models/user.model");
const schoolUser_model_1 = require("./models/schoolUser.model");
const school_model_1 = require("./models/school.model");
const team_model_1 = require("./models/team.model");
const userTeam_model_1 = require("./models/userTeam.model");
const sport_model_1 = require("./models/sport.model");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            sequelize_1.SequelizeModule.forFeature([]),
            sequelize_1.SequelizeModule.forRoot({
                dialect: process.env.DIALECT,
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABSE_PORT),
                username: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                dialectModule: mysql2_1.default,
                models: [vegetable_model_1.VegetableModel, user_model_1.UserModel, schoolUser_model_1.SchoolUserModel, school_model_1.SchoolModel, team_model_1.Teams, userTeam_model_1.UserTeams, sport_model_1.Sports],
                autoLoadModels: true,
                synchronize: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
                serveStaticOptions: {
                    index: false,
                },
            }),
            user_module_1.UserModule,
            vegetable_module_1.VegetableModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map