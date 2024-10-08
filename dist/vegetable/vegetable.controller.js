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
exports.VegetableController = void 0;
const common_1 = require("@nestjs/common");
const vegetable_service_1 = require("./vegetable.service");
const platform_express_1 = require("@nestjs/platform-express");
const axios_1 = require("axios");
const process = require("process");
const client_s3_1 = require("@aws-sdk/client-s3");
let VegetableController = class VegetableController {
    constructor(vegetableService) {
        this.vegetableService = vegetableService;
    }
    getAll({ page, search }) {
        return this.vegetableService.getAll(page, search);
    }
    async addNewVegetable(formData, file) {
        const s3 = new client_s3_1.S3Client();
        const bucketName = process.env.S3_BUCKET_NAME;
        const key = `uploads/${Date.now()}-${file.originalname}`;
        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: file.buffer,
        };
        try {
            const data = await s3.send(new client_s3_1.PutObjectCommand(uploadParams));
            if (data) {
                const response = this.vegetableService.addNewVeg({
                    name: formData.name,
                    thumbnail: `${process.env.AWS_CDN}/${key}`,
                    keywords: formData.keywords,
                    initial_qty: 250
                });
                if (response) {
                    return {
                        message: 'Vegetable added Successfully!',
                        filename: `${process.env.AWS_CDN}/${key}`,
                        name: formData.name
                    };
                }
            }
        }
        catch (err) {
            throw new Error(`File upload error: ${err.message}`);
        }
    }
    async myVegetable(payload) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
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
                msg.blocks.push({
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
                });
            });
            const { data } = await axios_1.default.post(process.env.SLACK_WEBHOOK, msg, config);
            return data;
        }
        catch (error) {
            console.log('error : ', error.message);
        }
    }
};
exports.VegetableController = VegetableController;
__decorate([
    (0, common_1.Get)(':page/:search?'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VegetableController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VegetableController.prototype, "addNewVegetable", null);
__decorate([
    (0, common_1.Post)('/send-message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VegetableController.prototype, "myVegetable", null);
exports.VegetableController = VegetableController = __decorate([
    (0, common_1.Controller)('vegetable'),
    __metadata("design:paramtypes", [vegetable_service_1.VegetableService])
], VegetableController);
//# sourceMappingURL=vegetable.controller.js.map