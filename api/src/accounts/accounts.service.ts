import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import type { ClerkUser } from '../auth/clerk-user.js';
import type { Account } from '@prisma/client';
import type { CreateAccountDto } from './dto/create-account.dto.js';

@Injectable()
export class AccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async create(clerkUser: ClerkUser, dto: CreateAccountDto): Promise<Account> {
    const user = await this.users.upsertFromClerkUser(clerkUser);

    return this.prisma.account.create({
      data: {
        userId: user.id,
        name: dto.name,
        ...(dto.status && { status: dto.status }),
      },
    });
  }
}
