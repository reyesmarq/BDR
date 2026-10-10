import type { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  it('upserts a user keyed by clerkId, forwarding available claims', async () => {
    const upsert = vi.fn().mockResolvedValue({ id: 'internal_1' });
    const prisma = { user: { upsert } } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await service.upsertFromClerkUser({
      id: 'user_123',
      email: 'rep@example.com',
      name: 'Rep Example',
    });

    expect(upsert).toHaveBeenCalledWith({
      where: { clerkId: 'user_123' },
      update: { email: 'rep@example.com', name: 'Rep Example' },
      create: {
        clerkId: 'user_123',
        email: 'rep@example.com',
        name: 'Rep Example',
      },
    });
  });

  it('omits email and name when the JWT does not carry those claims', async () => {
    const upsert = vi.fn().mockResolvedValue({ id: 'internal_1' });
    const prisma = { user: { upsert } } as unknown as PrismaService;
    const service = new UsersService(prisma);

    await service.upsertFromClerkUser({ id: 'user_123' });

    expect(upsert).toHaveBeenCalledWith({
      where: { clerkId: 'user_123' },
      update: {},
      create: { clerkId: 'user_123', email: undefined, name: undefined },
    });
  });
});
