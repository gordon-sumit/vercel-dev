import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {VegetableService} from "./vegetable.service";
import {FileInterceptor} from "@nestjs/platform-express";
import axios from "axios";
import * as process from "process";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {config, Credentials, S3} from "aws-sdk";

@Controller('vegetable')
export class VegetableController {
    constructor(private vegetableService: VegetableService) {
    }

    @Get(':page/:order?/:search?')
    async getAll(@Param() {page, order, search}, @Headers('temporaryCredentials') temporaryCredentials) {
        return await this.vegetableService.getAll(page, order, search, JSON.parse(temporaryCredentials));
    }

    @Post('/add')
    @UseInterceptors(FileInterceptor('file'))
    async addNewVegetable(
        @Body() formData,
        @UploadedFile() file: Express.Multer.File,
        @Headers('temporaryCredentials') temporaryCredentials
    ) {
        try {
            const key = `uploads/${Date.now()}-${file.originalname}`;
            const response = await this.vegetableService.addNewVeg({
                name: formData.name,
                key: key,
                thumbnail: `${process.env.AWS_CDN}/${key}`,
                keywords: formData.keywords,
                initial_qty: 50
            }, file, key, JSON.parse(temporaryCredentials));
            if (response) {
                return {
                    message: 'Vegetable added Successfully!',
                    filename: `${process.env.AWS_CDN}/${key}`,
                    name: formData.name
                };
            }
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    @Post('/send-message-slack')
    async myVegetable(@Body() payload) {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            let msg = {
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Please find given vegetables*"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "*Item*"
                            },
                            {
                                "type": "mrkdwn",
                                "text": "*Quantity*"
                            }
                        ]
                    }
                ]
            };
            payload.map(item => {
                msg.blocks.push(
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": item.name
                            },
                            {
                                "type": "mrkdwn",
                                "text": item.qtyType !== 'Rs' ? item.qty > 750 ? `${item.qty / 1000}kg` : `${item.qty} gm` : `${item.qty} Rs`
                            }
                        ]
                    }
                )
            });
            const {data} = await axios.post(
                process.env.SLACK_WEBHOOK,
                msg,
                config
            );
            return data;
        } catch (error) {
            console.log('error : ', error.message)
        }

    }

    @Post('/send-message-whatsapp-business')
    async sendWhatsAppMsg(@Body() payload) {
        try {
            let msgContent = '';
            payload.map(item => {
                msgContent += `${item.name} - ${item.qtyType !== 'Rs' ? item.qty > 750 ? `${item.qty / 1000}kg` : `${item.qty} gm` : `${item.qty} Rs`}`;
            });

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
                },
            }
            const msg = {
                "messaging_product": "whatsapp",
                "to": process.env.WHATSAPP_TO_PHONE,
                "type": "template",
                "template": {
                    "name": "vegetables", "language": {"code": "en_US"},
                    "components": [
                        {
                            "type": "header",  // Specifies the header component
                            "parameters": [
                                {
                                    "type": "image",
                                    "image": {
                                        "link": "https://png.pngtree.com/png-vector/20240708/ourmid/pngtree-fresh-vegetables-with-wicker-basket-png-image_13008114.png"
                                    }
                                }
                            ]
                        },
                        {
                            "type": "body",
                            "parameters": [
                                {"type": "text", "text": msgContent.trim()}
                            ]
                        },
                    ]
                }
            };
            const {data} = await axios.post(
                process.env.WHATSAPP_URL,
                msg,
                config
            );
            console.log(data)
            return data;
        } catch (e) {
            console.log(e.response.data)
        }
    }

    @Post('/send-message-whatsapp')
    async sendWhatsAppMsgUsingTwilio(@Body() payload) {
        try {
            let msgContent = 'Hi Sumit,\n```Please find below the vegetables list:```';
            payload.map((item, index) => {
                msgContent += `\n${index + 1}. ${item.name} - ${item.qtyType !== 'Rs' ? item.qty > 750 ? `*${item.qty / 1000}kg*` : `*${item.qty} gm*` : `*${item.qty} Rs*`}`;
            });
            msgContent += '\n```Thank You!```';
            const toPhoneNumber = process.env.WHATSAPP_TO_PHONE;
            return await this.vegetableService.sendWhatsAppMessage(toPhoneNumber, msgContent.trim());
        } catch (e) {
            console.log(e)
        }
    }

    @Post('/send-message-mail')
    async sendMail(@Body() payload) {
        try {
            let msgContent = '<p><strong>Hi Sumit</strong>,Please find below the vegetables list:</p>';
            msgContent += '<ol>'
            payload.map((item) => {
                msgContent += `<li>${item.name} - ${item.qtyType !== 'Rs' ? item.qty > 750 ? `*${item.qty / 1000}kg*` : `*${item.qty} gm*` : `*${item.qty} Rs*`}</li>`;
            });
            msgContent += '</ol><br><p>Thank You!</p>';
            return await this.vegetableService.mail(msgContent);
        } catch (e) {
            console.log(e)
        }
    }

    @Delete('/delete/:id')
    deleteItem(@Param('id') id: number) {
        return this.vegetableService.removeItem({where: {id: id}});
    }
}
