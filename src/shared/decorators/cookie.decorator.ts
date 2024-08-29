import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const cookie = request.cookies[data];

    if (!cookie) {
      throw new BadRequestException();
    }

    return cookie;
  }
);
