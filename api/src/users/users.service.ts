import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ClerkUser } from '../auth/clerk-user.js';
import type { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Maps a validated Clerk JWT to its internal User row, creating it on first sight. */
  upsertFromClerkUser(clerkUser: ClerkUser): Promise<User> {
    const email =
      typeof clerkUser.email === 'string' ? clerkUser.email : undefined;
    const name =
      typeof clerkUser.name === 'string' ? clerkUser.name : undefined;

    return this.prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: { ...(email && { email }), ...(name && { name }) },
      create: { clerkId: clerkUser.id, email, name },
    });
  }
}
