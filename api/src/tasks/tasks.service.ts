import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ClerkUser } from '../auth/clerk-user.js';
import type { Task } from '@prisma/client';
import type { CreateTaskDto } from './dto/create-task.dto.js';
import type { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private findOwnedAccount(clerkUser: ClerkUser, accountId: string) {
    return this.prisma.account.findFirst({
      where: { id: accountId, user: { clerkId: clerkUser.id } },
      select: { id: true },
    });
  }

  async create(
    clerkUser: ClerkUser,
    accountId: string,
    dto: CreateTaskDto,
  ): Promise<Task | null> {
    const account = await this.findOwnedAccount(clerkUser, accountId);
    if (!account) {
      return null;
    }

    return this.prisma.task.create({
      data: {
        accountId,
        title: dto.title,
        dueDate: new Date(dto.dueDate),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async update(
    clerkUser: ClerkUser,
    accountId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<Task | null> {
    const task = await this.findOwnedTask(clerkUser, accountId, taskId);
    if (!task) {
      return null;
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.dueDate !== undefined && { dueDate: new Date(dto.dueDate) }),
      },
    });
  }

  async complete(
    clerkUser: ClerkUser,
    accountId: string,
    taskId: string,
  ): Promise<Task | null> {
    const task = await this.findOwnedTask(clerkUser, accountId, taskId);
    if (!task) {
      return null;
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status: 'complete', completedAt: new Date() },
    });
  }

  private async findOwnedTask(
    clerkUser: ClerkUser,
    accountId: string,
    taskId: string,
  ) {
    const account = await this.findOwnedAccount(clerkUser, accountId);
    if (!account) {
      return null;
    }

    return this.prisma.task.findFirst({ where: { id: taskId, accountId } });
  }
}
