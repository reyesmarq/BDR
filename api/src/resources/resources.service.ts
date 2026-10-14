import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import type { ClerkUser } from '../auth/clerk-user.js';
import type { Resource } from '@prisma/client';
import type { CreateResourceDto } from './dto/create-resource.dto.js';

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async create(
    clerkUser: ClerkUser,
    dto: CreateResourceDto,
  ): Promise<Resource> {
    const user = await this.users.upsertFromClerkUser(clerkUser);

    return this.prisma.resource.create({
      data: {
        userId: user.id,
        title: dto.title,
        type: dto.type,
        content: dto.content,
      },
    });
  }

  findAll(clerkUser: ClerkUser): Promise<Resource[]> {
    return this.prisma.resource.findMany({
      where: { user: { clerkId: clerkUser.id } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
