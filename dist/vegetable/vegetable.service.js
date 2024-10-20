"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VegetableService = void 0;
const common_1 = require("@nestjs/common");
const vegetable_model_1 = require("../models/vegetable.model");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const Twilio = require("twilio");
const process = require("process");
const nodemailer = require("nodemailer");
let VegetableService = class VegetableService {
    constructor(vegetableModel) {
        this.vegetableModel = vegetableModel;
        this.client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        console.log(process.env.MAIL_PASS, 'process.env.MAIL_PASS');
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_SECURE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }
    async getAll(page, order, search = null) {
        const pageSize = 10;
        const offset = (page - 1) * pageSize;
        return await this.vegetableModel.findAndCountAll({
            limit: pageSize, offset: offset,
            order: [['createdAt', order]],
            where: search ? {
                keywords: { [sequelize_2.Op.substring]: search }
            } : {},
        });
    }
    async addNewVeg(data) {
        return await this.vegetableModel.create(data);
    }
    async removeItem(id) {
        return await this.vegetableModel.destroy(id);
    }
    async sendWhatsAppMessage(to, message) {
        const from = process.env.TWILIO_PHONE_NUMBER;
        return this.client.messages.create({
            body: message,
            from: `whatsapp:${from}`,
            to: `whatsapp:${to}`,
        });
    }
    async mail(message) {
        const info = await this.transporter.sendMail({
            to: process.env.MAIL_TO,
            subject: "Vegetables list",
            html: message,
        });
        console.log("Message sent: %s", info.messageId);
        return info.messageId;
    }
};
exports.VegetableService = VegetableService;
exports.VegetableService = VegetableService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(vegetable_model_1.VegetableModel)),
    __metadata("design:paramtypes", [Object])
], VegetableService);
//# sourceMappingURL=vegetable.service.js.map