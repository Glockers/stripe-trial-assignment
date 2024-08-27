import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { middleware } from './app.middleware';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { Logger as NestLogger } from '@nestjs/common';
import { CORS_OPTION } from './shared/constants/cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.enableCors(CORS_OPTION);

  middleware(app);

  app.enableShutdownHooks();
  await app.listen(configService.get('PORT'), '0.0.0.0');
  return app.getUrl();
}

void (async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
