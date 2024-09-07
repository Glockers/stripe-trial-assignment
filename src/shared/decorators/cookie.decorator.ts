import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const cookie = request.cookies[cookieName];

    if (!cookie) {
      throw new BadRequestException(`Cookie: "${cookieName}" not found`);
    }

    return cookie;
  }
);
