import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import rawBodyMiddleware from './shared/rawBody.middleware';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(rawBodyMiddleware());
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  });
  app.use(cookieParser());
  app.use(helmet());
  await app.listen(5000);
}
bootstrap();
