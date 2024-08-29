import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';

export const Cookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const cookie = request.cookies[cookieName];
    console.log('Test cookie', cookie);
    if (!cookie) {
      throw new BadRequestException(`Cookie: "${cookieName}" not found`);
    }

    return cookie;
  }
);
