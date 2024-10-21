import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
//import {Queue} from 'bullmq'
//import {InjectQueue} from "@nestjs/bullmq";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        // @InjectQueue('test') private readonly testQueue: Queue
    ) {
    }

    @Get()
    getHello() {
        //await this.testQueue.add('tst',{ taskName: 'Task 1 kblfdksf lsjdf', payload: { someData: 123 } });

        // Adding event listeners (optional)
        // this.testQueue.on('failed', (job, error) => {
        //   console.error(`Job ${job.id} failed:`, error);
        // });
        return this.appService.getHello();
    }

    @Get()
    processJobs() {

    }

}
