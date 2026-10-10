import type { PrismaService } from '../prisma/prisma.service.js';
import type { UsersService } from '../users/users.service.js';
import { AccountsService } from './accounts.service.js';

describe('AccountsService', () => {
  it('creates an account scoped to the resolved internal user', async () => {
    const clerkUser = { id: 'user_123' };
    const internalUser = { id: 'internal_1' };
    const created = {
      id: 'a1',
      userId: 'internal_1',
      name: 'Acme Robotics',
      status: 'new',
    };

    const upsertFromClerkUser = vi.fn().mockResolvedValue(internalUser);
    const users = { upsertFromClerkUser } as unknown as UsersService;
    const create = vi.fn().mockResolvedValue(created);
    const prisma = { account: { create } } as unknown as PrismaService;

    const service = new AccountsService(prisma, users);
    const result = await service.create(clerkUser, { name: 'Acme Robotics' });

    expect(upsertFromClerkUser).toHaveBeenCalledWith(clerkUser);
    expect(create).toHaveBeenCalledWith({
      data: { userId: 'internal_1', name: 'Acme Robotics' },
    });
    expect(result).toBe(created);
  });

  it('forwards an explicit status to the created account', async () => {
    const users = {
      upsertFromClerkUser: vi.fn().mockResolvedValue({ id: 'internal_1' }),
    } as unknown as UsersService;
    const create = vi.fn().mockResolvedValue({});
    const prisma = { account: { create } } as unknown as PrismaService;

    const service = new AccountsService(prisma, users);
    await service.create(
      { id: 'user_123' },
      { name: 'Northwind Foods', status: 'contacted' },
    );

    expect(create).toHaveBeenCalledWith({
      data: {
        userId: 'internal_1',
        name: 'Northwind Foods',
        status: 'contacted',
      },
    });
  });
});
