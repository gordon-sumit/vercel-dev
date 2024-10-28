import {BadRequestException, Injectable} from '@nestjs/common';
import {VegetableModel} from "../models/vegetable.model";
import {InjectModel} from "@nestjs/sequelize";
import {Op, where} from "sequelize";
import * as Twilio from "twilio";
import * as process from "process";
import * as nodemailer from 'nodemailer';
import {Credentials, S3} from "aws-sdk";
import {ExpiredCodeException} from "@aws-sdk/client-cognito-identity-provider";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

@Injectable()
export class VegetableService {
    private client: Twilio.Twilio;
    private transporter: nodemailer.Transporter;
    private readonly bucket = process.env.S3_BUCKET_NAME;


    constructor(@InjectModel(VegetableModel) private vegetableModel: typeof VegetableModel) {
        this.client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
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

    async getAll(page, order, search = null, tempCredentials): Promise<any> {
        const pageSize = 10;
        const offset = (page - 1) * pageSize;
        const allData = await this.vegetableModel.findAndCountAll({
            limit: pageSize, offset: offset,
            order: [['createdAt', order]],
            where: search ? {
                keywords: {[Op.substring]: search}
            } : {},
        });
        try {
            if (allData.rows) {
                const credentials = await new Credentials(
                    {
                        accessKeyId: String(tempCredentials.AccessKeyId),
                        secretAccessKey: String(tempCredentials.SecretKey),
                        sessionToken: String(tempCredentials.SessionToken),
                    });
                const s3 = new S3({
                    region: 'us-west-2',
                    credentials: credentials,
                });
                allData.rows = await Promise.all(
                    allData.rows.map(async (item) => {
                        const signedUrl = await s3.getSignedUrlPromise('getObject', {
                            Bucket: this.bucket,
                            Key: item.key,
                            Expires: 3600,
                        });
                        return {...item.get(), singedUrl: signedUrl}
                    })
                );
                return allData;
            }
        } catch (e) {
            throw new ExpiredCodeException(e.message())
        }

    }

    async addNewVeg(data, file, key, tempCredentials): Promise<any> {
         const result = await this.vegetableModel.create(data);
         if (result) {
            try {
                const credentials = await new Credentials(
                    {
                        accessKeyId: String(tempCredentials.AccessKeyId),
                        secretAccessKey: String(tempCredentials.SecretKey),
                        sessionToken: String(tempCredentials.SessionToken),
                    });
                const s3 = await new S3({
                    region: 'us-west-2',
                    credentials: credentials,
                });
                const bucketName = process.env.S3_BUCKET_NAME;
                const uploadParams = {
                    Bucket: bucketName,
                    Key: key,
                    Body: file.buffer,
                };
                //const data = await s3.send(new PutObjectCommand(uploadParams));
                return await s3.putObject(uploadParams).promise();
            } catch (err) {
                throw new BadRequestException(`File upload error: ${err.message}`);
            }
        }
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
