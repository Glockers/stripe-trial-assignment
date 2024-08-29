import { Logger as NestLogger } from '@nestjs/common';
import { repl } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const replServer = await repl(AppModule);
  replServer.setupHistory('.nestjs_repl_history', (err) => {
    if (err) {
      console.error(err);
    }
  });
}

void (async (): Promise<void> => {
  try {
    await bootstrap();
    NestLogger.log('REPLServer is started!', 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
