import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('this is test')
  app.enableCors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
  await app.listen(3000);
}
bootstrap();
