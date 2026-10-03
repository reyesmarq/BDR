import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { ClerkUser } from '../clerk-user.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ClerkUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: ClerkUser }>();
    return request.user;
  },
);
