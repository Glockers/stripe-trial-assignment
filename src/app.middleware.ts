import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rawBodyMiddleware from './shared/middlewares/rawBody.middleware';

export function middleware(app: INestApplication): INestApplication {
  app.use(cookieParser());
  app.use(helmet());
  app.use(rawBodyMiddleware());

  return app;
}
