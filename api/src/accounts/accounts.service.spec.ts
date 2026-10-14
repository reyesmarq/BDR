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
  it('lists accounts only for the signed-in rep, ordered by name', async () => {
    const found = [{ id: 'a1' }, { id: 'a2' }];
    const findMany = vi.fn().mockResolvedValue(found);
    const prisma = { account: { findMany } } as unknown as PrismaService;
    const users = {} as unknown as UsersService;

    const service = new AccountsService(prisma, users);
    const result = await service.findAll({ id: 'user_123' });

    expect(findMany).toHaveBeenCalledWith({
      where: { user: { clerkId: 'user_123' } },
      orderBy: { name: 'asc' },
    });
    expect(result).toBe(found);
  });

  it('finds an account only through the signed-in rep clerk id', async () => {
    const found = { id: 'a1', name: 'Acme Robotics' };
    const findFirst = vi.fn().mockResolvedValue(found);
    const prisma = { account: { findFirst } } as unknown as PrismaService;
    const users = {} as unknown as UsersService;

    const service = new AccountsService(prisma, users);
    const result = await service.findOne({ id: 'user_123' }, 'a1');

    expect(findFirst).toHaveBeenCalledWith({
      where: { id: 'a1', user: { clerkId: 'user_123' } },
      include: {
        contacts: true,
        tasks: { orderBy: { dueDate: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } },
      },
    });
    expect(result).toBe(found);
  });
  it('returns null when the account is not owned by the signed-in rep', async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const prisma = { account: { findFirst } } as unknown as PrismaService;
    const users = {} as unknown as UsersService;

    const service = new AccountsService(prisma, users);
    const result = await service.findOne(
      { id: 'user_123' },
      'other-rep-account',
    );

    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'other-rep-account', user: { clerkId: 'user_123' } },
      }),
    );
    expect(result).toBeNull();
  });

  it('updates an owned account with the provided fields', async () => {
    const findFirst = vi.fn().mockResolvedValue({ id: 'a1' });
    const updated = {
      id: 'a1',
      name: 'Acme Robotics Inc.',
      status: 'contacted',
    };
    const update = vi.fn().mockResolvedValue(updated);
    const prisma = {
      account: { findFirst, update },
    } as unknown as PrismaService;
    const users = {} as unknown as UsersService;

    const service = new AccountsService(prisma, users);
    const result = await service.update({ id: 'user_123' }, 'a1', {
      name: 'Acme Robotics Inc.',
      status: 'contacted',
    });

    expect(findFirst).toHaveBeenCalledWith({
      where: { id: 'a1', user: { clerkId: 'user_123' } },
      select: { id: true },
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: 'a1' },
      data: { name: 'Acme Robotics Inc.', status: 'contacted' },
    });
    expect(result).toBe(updated);
  });

  it('returns null when updating an account the rep does not own', async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const update = vi.fn();
    const prisma = {
      account: { findFirst, update },
    } as unknown as PrismaService;
    const users = {} as unknown as UsersService;

    const service = new AccountsService(prisma, users);
    const result = await service.update(
      { id: 'user_123' },
      'other-rep-account',
      { name: 'New name' },
    );

    expect(update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
