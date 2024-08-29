import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import rawBodyMiddleware from './shared/middlewares/rawBody.middleware';
import helmet from 'helmet';

export function middleware(app: INestApplication): INestApplication {
  app.use(helmet());
  app.use(cookieParser());
  app.use(rawBodyMiddleware());
  app.useGlobalPipes(new ValidationPipe());

  return app;
}
