import {Injectable} from '@nestjs/common';
import {VegetableModel} from "../models/vegetable.model";
import {InjectModel} from "@nestjs/sequelize";
import {Op, where} from "sequelize";
import * as Twilio from "twilio";
import * as process from "process";
import * as nodemailer from 'nodemailer';

@Injectable()
export class VegetableService {
    private client: Twilio.Twilio;
    private transporter: nodemailer.Transporter;


    constructor(@InjectModel(VegetableModel) private vegetableModel: typeof VegetableModel) {
        this.client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        console.log(process.env.MAIL_PASS, 'process.env.MAIL_PASS')
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_SECURE, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async getAll(page, order, search = null): Promise<any> {
        const pageSize = 10;
        const offset = (page - 1) * pageSize;
        return await this.vegetableModel.findAndCountAll({
            limit: pageSize, offset: offset,
            order: [['createdAt', order]],
            where: search ? {
                keywords: {[Op.substring]: search}
            } : {},
        });
    }

    async addNewVeg(data): Promise<any> {
        return await this.vegetableModel.create(data);
    }


    async removeItem(id): Promise<any> {
        return await this.vegetableModel.destroy(id)
    }

    async sendWhatsAppMessage(to: string, message: string): Promise<any> {
        const from = process.env.TWILIO_PHONE_NUMBER;
        return this.client.messages.create({
            body: message,
            from: `whatsapp:${from}`,
            to: `whatsapp:${to}`,
        });
    }

    async mail(message) {
        // send mail with defined transport object
        const info = await this.transporter.sendMail({
            //from: '"Maddison Foo Koch 👻" gordon sumit', // sender address
            to: process.env.MAIL_TO, // list of receivers
            subject: "Vegetables list", // Subject line
            // text: "Hello world?", // plain text body
            html: message, // html body
        });
        console.log("Message sent: %s", info.messageId);
        return info.messageId;
    }
}
