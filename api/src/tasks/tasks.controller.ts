import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { ClerkUser } from '../auth/clerk-user.js';
import type { Task } from '@prisma/client';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Controller('accounts/:accountId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @CurrentUser() user: ClerkUser,
    @Param('accountId') accountId: string,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    const task = await this.tasksService.create(user, accountId, dto);
    if (!task) {
      throw new NotFoundException('Account not found');
    }
    return task;
  }

  @Patch(':taskId')
  async update(
    @CurrentUser() user: ClerkUser,
    @Param('accountId') accountId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.tasksService.update(user, accountId, taskId, dto);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  @Patch(':taskId/complete')
  async complete(
    @CurrentUser() user: ClerkUser,
    @Param('accountId') accountId: string,
    @Param('taskId') taskId: string,
  ): Promise<Task> {
    const task = await this.tasksService.complete(user, accountId, taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
