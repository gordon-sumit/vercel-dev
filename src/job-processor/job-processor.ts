import {Processor, WorkerHost} from "@nestjs/bullmq";
import { Job } from 'bullmq';

@Processor('test')

export class JobProcessor extends WorkerHost{
    async process(job: Job<any, any, string>): Promise<any> {
        let progress = 0;
        for (let i = 0; i < 3; i++) {
            console.log(job.progress)
            progress += 1;

            //await job.progress(progress)
        }
        return {};
    }
}
