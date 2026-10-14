import type { PrismaService } from '../prisma/prisma.service.js';
import type { UsersService } from '../users/users.service.js';
import { ResourcesService } from './resources.service.js';

describe('ResourcesService', () => {
  it('creates a resource scoped to the resolved internal user', async () => {
    const clerkUser = { id: 'user_123' };
    const internalUser = { id: 'internal_1' };
    const created = {
      id: 'r1',
      userId: 'internal_1',
      title: 'Cold outreach template',
      type: 'email_template',
      content: 'Hi {{name}}, ...',
    };

    const upsertFromClerkUser = vi.fn().mockResolvedValue(internalUser);
    const users = { upsertFromClerkUser } as unknown as UsersService;
    const create = vi.fn().mockResolvedValue(created);
    const prisma = { resource: { create } } as unknown as PrismaService;

    const service = new ResourcesService(prisma, users);
    const result = await service.create(clerkUser, {
      title: 'Cold outreach template',
      type: 'email_template',
      content: 'Hi {{name}}, ...',
    });

    expect(upsertFromClerkUser).toHaveBeenCalledWith(clerkUser);
    expect(create).toHaveBeenCalledWith({
      data: {
        userId: 'internal_1',
        title: 'Cold outreach template',
        type: 'email_template',
        content: 'Hi {{name}}, ...',
      },
    });
    expect(result).toBe(created);
  });

  it('lists resources only for the signed-in rep', async () => {
    const found = [{ id: 'r1' }, { id: 'r2' }];
    const findMany = vi.fn().mockResolvedValue(found);
    const prisma = { resource: { findMany } } as unknown as PrismaService;
    const users = {} as unknown as UsersService;

    const service = new ResourcesService(prisma, users);
    const result = await service.findAll({ id: 'user_123' });

    expect(findMany).toHaveBeenCalledWith({
      where: { user: { clerkId: 'user_123' } },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toBe(found);
  });
});
