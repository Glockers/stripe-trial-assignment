import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS_OPTION: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
};
