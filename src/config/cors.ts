import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const ALLOWS_URL = ['http://localhost:3000'];

export const CORS_OPTION: CorsOptions = {
  origin: ALLOWS_URL,
  methods: '*',
  credentials: true
};
