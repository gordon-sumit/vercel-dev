"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
let JobProcessor = class JobProcessor extends bullmq_1.WorkerHost {
    async process(job) {
        let progress = 0;
        for (let i = 0; i < 3; i++) {
            console.log(job.progress);
            progress += 1;
        }
        return {};
    }
};
exports.JobProcessor = JobProcessor;
exports.JobProcessor = JobProcessor = __decorate([
    (0, bullmq_1.Processor)('test')
], JobProcessor);
//# sourceMappingURL=job-processor.js.map