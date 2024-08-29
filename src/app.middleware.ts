import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import rawBodyMiddleware from './shared/middlewares/rawBody.middleware';
import helmet from 'helmet';
import { CORS_OPTION } from './config/cors';

export function middleware(app: INestApplication): INestApplication {
  app.use(helmet());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.enableShutdownHooks();
  app.use(cookieParser());
  app.enableCors(CORS_OPTION);
  app.use(rawBodyMiddleware());
  app.useGlobalPipes(new ValidationPipe());

  return app;
}
