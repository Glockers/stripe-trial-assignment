import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { COOKIE_MAX_AGE } from 'src/shared/constants/cookies';

const ALLOWS_URL = ['http://localhost:3000'];

export const CORS_OPTION: CorsOptions = {
  origin: ALLOWS_URL,
  methods: '*',
  credentials: true,
  maxAge: COOKIE_MAX_AGE
};
