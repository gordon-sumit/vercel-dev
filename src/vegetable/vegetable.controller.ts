import {Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {VegetableService} from "./vegetable.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import axios from "axios";

@Controller('vegetable')
export class VegetableController {
    constructor(private vegetableService: VegetableService) {
    }

    @Get(':page/:search?')
    getAll(@Param() {page,search}) {
        return this.vegetableService.getAll(page,search);
    }

    @Post('/add')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    }))
    addNewVegetable(
        @Body() formData,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log(formData)
        const response = this.vegetableService.addNewVeg({
            name: formData.name,
            thumbnail: file.filename,
            keywords: formData.keywords,
            initial_qty: 250
        })
        if (response) {
            return {
                message: 'Vegetable added!',
                filename: file.filename,
                name: formData.name
            };
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
                `https://hooks.slack.com/services/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`,
                msg,
                config
            );
            return data;
        } catch (error) {
            console.log('error : ', error.message)
        }

    }

}
