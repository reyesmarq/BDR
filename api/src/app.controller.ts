import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from './auth/decorators/current-user.decorator.js';
import { Public } from './auth/decorators/public.decorator.js';
import type { ClerkUser } from './auth/clerk-user.js';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  getMe(@CurrentUser() user: ClerkUser): ClerkUser {
    return user;
  }
}
