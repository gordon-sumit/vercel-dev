import {Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {VegetableService} from "./vegetable.service";
import {FileInterceptor} from "@nestjs/platform-express";
import axios from "axios";
import * as process from "process";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

@Controller('vegetable')
export class VegetableController {
    constructor(private vegetableService: VegetableService) {
    }

    @Get(':page/:search?')
    getAll(@Param() {page, search}) {
        return this.vegetableService.getAll(page, search);
    }

    @Post('/add')
    @UseInterceptors(FileInterceptor('file'))
    async addNewVegetable(
        @Body() formData,
        @UploadedFile() file: Express.Multer.File
    ) {
        const s3 = new S3Client();
        const bucketName = process.env.S3_BUCKET_NAME;
        const key = `uploads/${Date.now()}-${file.originalname}`;
        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
        };
        try {
            const data = await s3.send(new PutObjectCommand(uploadParams));
            if (data) {
                const response = this.vegetableService.addNewVeg({
                    name: formData.name,
                    thumbnail: `${process.env.AWS_CDN}/${key}`,
                    keywords: formData.keywords,
                    initial_qty: 250
                })
                if (response) {
                    return {
                        message: 'Vegetable added!',
                        filename: `${process.env.AWS_CDN}/${key}`,
                        name: formData.name
                    };
                }
            }
        } catch (err) {
            throw new Error(`File upload error: ${err.message}`);
        }
    }

    @Post('/send-message')
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
                                "text": item.qty > 750 ? `${item.qty / 1000}kg` : `${item.qty} gm`
                            }
                        ]
                    }
                )
            })

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

}
