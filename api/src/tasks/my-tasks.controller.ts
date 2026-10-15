import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { ClerkUser } from '../auth/clerk-user.js';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
export class MyTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: ClerkUser) {
    return this.tasksService.findAllForRep(user);
  }
}
