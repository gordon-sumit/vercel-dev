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
let VegetableController = class VegetableController {
    constructor(vegetableService) {
        this.vegetableService = vegetableService;
    }
    async getAll({ page, order, search }, temporaryCredentials) {
        return await this.vegetableService.getAll(page, order, search, JSON.parse(temporaryCredentials));
    }
    async addNewVegetable(formData, file, temporaryCredentials) {
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
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
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
                            "text": item.qtyType !== 'Rs' ? item.qty > 750 ? `${item.qty / 1000}kg` : `${item.qty} gm` : `${item.qty} Rs`
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
    async sendWhatsAppMsg(payload) {
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
            };
            const msg = {
                "messaging_product": "whatsapp",
                "to": process.env.WHATSAPP_TO_PHONE,
                "type": "template",
                "template": {
                    "name": "vegetables", "language": { "code": "en_US" },
                    "components": [
                        {
                            "type": "header",
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
                                { "type": "text", "text": msgContent.trim() }
                            ]
                        },
                    ]
                }
            };
            const { data } = await axios_1.default.post(process.env.WHATSAPP_URL, msg, config);
            console.log(data);
            return data;
        }
        catch (e) {
            console.log(e.response.data);
        }
    }
    async sendWhatsAppMsgUsingTwilio(payload) {
        try {
            let msgContent = 'Hi Sumit,\n```Please find below the vegetables list:```';
            payload.map((item, index) => {
                msgContent += `\n${index + 1}. ${item.name} - ${item.qtyType !== 'Rs' ? item.qty > 750 ? `*${item.qty / 1000}kg*` : `*${item.qty} gm*` : `*${item.qty} Rs*`}`;
            });
            msgContent += '\n```Thank You!```';
            const toPhoneNumber = process.env.WHATSAPP_TO_PHONE;
            return await this.vegetableService.sendWhatsAppMessage(toPhoneNumber, msgContent.trim());
        }
        catch (e) {
            console.log(e);
        }
    }
    async sendMail(payload) {
        try {
            let msgContent = '<p><strong>Hi Sumit</strong>,Please find below the vegetables list:</p>';
            msgContent += '<ol>';
            payload.map((item) => {
                msgContent += `<li>${item.name} - ${item.qtyType !== 'Rs' ? item.qty > 750 ? `*${item.qty / 1000}kg*` : `*${item.qty} gm*` : `*${item.qty} Rs*`}</li>`;
            });
            msgContent += '</ol><br><p>Thank You!</p>';
            return await this.vegetableService.mail(msgContent);
        }
        catch (e) {
            console.log(e);
        }
    }
    deleteItem(id) {
        return this.vegetableService.removeItem({ where: { id: id } });
    }
};
exports.VegetableController = VegetableController;
__decorate([
    (0, common_1.Get)(':page/:order?/:search?'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Headers)('temporaryCredentials')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VegetableController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Headers)('temporaryCredentials')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], VegetableController.prototype, "addNewVegetable", null);
__decorate([
    (0, common_1.Post)('/send-message-slack'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VegetableController.prototype, "myVegetable", null);
__decorate([
    (0, common_1.Post)('/send-message-whatsapp-business'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VegetableController.prototype, "sendWhatsAppMsg", null);
__decorate([
    (0, common_1.Post)('/send-message-whatsapp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VegetableController.prototype, "sendWhatsAppMsgUsingTwilio", null);
__decorate([
    (0, common_1.Post)('/send-message-mail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VegetableController.prototype, "sendMail", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VegetableController.prototype, "deleteItem", null);
exports.VegetableController = VegetableController = __decorate([
    (0, common_1.Controller)('vegetable'),
    __metadata("design:paramtypes", [vegetable_service_1.VegetableService])
], VegetableController);
//# sourceMappingURL=vegetable.controller.js.map