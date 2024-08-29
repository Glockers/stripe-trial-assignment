import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { middleware } from './app.middleware';
import { Logger } from 'nestjs-pino';
import { Logger as NestLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  });

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  middleware(app);

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
