import { AppService } from './app.service';
import { Queue } from 'bullmq';
export declare class AppController {
    private readonly appService;
    private readonly testQueue;
    constructor(appService: AppService, testQueue: Queue);
    getHello(): Promise<any>;
    processJobs(): void;
}
