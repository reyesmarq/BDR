import type { PrismaService } from '../prisma/prisma.service.js';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  it('creates a task when the account is owned by the signed-in rep', async () => {
    const findFirst = vi.fn().mockResolvedValue({ id: 'a1' });
    const created = { id: 't1', accountId: 'a1', title: 'Call back' };
    const create = vi.fn().mockResolvedValue(created);
    const prisma = {
      account: { findFirst },
      task: { create },
    } as unknown as PrismaService;

    const service = new TasksService(prisma);
    const result = await service.create({ id: 'user_123' }, 'a1', {
      title: 'Call back',
      dueDate: '2026-11-01T00:00:00.000Z',
    });

    expect(findFirst).toHaveBeenCalledWith({
      where: { id: 'a1', user: { clerkId: 'user_123' } },
      select: { id: true },
    });
    expect(create).toHaveBeenCalledWith({
      data: {
        accountId: 'a1',
        title: 'Call back',
        dueDate: new Date('2026-11-01T00:00:00.000Z'),
      },
    });
    expect(result).toBe(created);
  });

  it('returns null when creating a task on an account the rep does not own', async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const create = vi.fn();
    const prisma = {
      account: { findFirst },
      task: { create },
    } as unknown as PrismaService;

    const service = new TasksService(prisma);
    const result = await service.create(
      { id: 'user_123' },
      'other-rep-account',
      { title: 'Call back', dueDate: '2026-11-01T00:00:00.000Z' },
    );

    expect(create).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('updates a task that belongs to an owned account', async () => {
    const accountFindFirst = vi.fn().mockResolvedValue({ id: 'a1' });
    const taskFindFirst = vi
      .fn()
      .mockResolvedValue({ id: 't1', accountId: 'a1' });
    const updated = { id: 't1', title: 'Updated title' };
    const update = vi.fn().mockResolvedValue(updated);
    const prisma = {
      account: { findFirst: accountFindFirst },
      task: { findFirst: taskFindFirst, update },
    } as unknown as PrismaService;

    const service = new TasksService(prisma);
    const result = await service.update({ id: 'user_123' }, 'a1', 't1', {
      title: 'Updated title',
    });

    expect(taskFindFirst).toHaveBeenCalledWith({
      where: { id: 't1', accountId: 'a1' },
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: 't1' },
      data: { title: 'Updated title' },
    });
    expect(result).toBe(updated);
  });

  it('returns null when updating a task that does not belong to the account', async () => {
    const accountFindFirst = vi.fn().mockResolvedValue({ id: 'a1' });
    const taskFindFirst = vi.fn().mockResolvedValue(null);
    const update = vi.fn();
    const prisma = {
      account: { findFirst: accountFindFirst },
      task: { findFirst: taskFindFirst, update },
    } as unknown as PrismaService;

    const service = new TasksService(prisma);
    const result = await service.update(
      { id: 'user_123' },
      'a1',
      'not-this-task',
      {
        title: 'Updated title',
      },
    );

    expect(update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('marks an owned task complete', async () => {
    const accountFindFirst = vi.fn().mockResolvedValue({ id: 'a1' });
    const taskFindFirst = vi
      .fn()
      .mockResolvedValue({ id: 't1', accountId: 'a1' });
    const completed = { id: 't1', status: 'complete' };
    const update = vi.fn().mockResolvedValue(completed);
    const prisma = {
      account: { findFirst: accountFindFirst },
      task: { findFirst: taskFindFirst, update },
    } as unknown as PrismaService;

    const service = new TasksService(prisma);
    const result = await service.complete({ id: 'user_123' }, 'a1', 't1');

    expect(update).toHaveBeenCalledTimes(1);
    const [{ where, data }] = update.mock.calls[0] as [
      { where: { id: string }; data: { status: string; completedAt: Date } },
    ];
    expect(where).toEqual({ id: 't1' });
    expect(data.status).toBe('complete');
    expect(data.completedAt).toBeInstanceOf(Date);
    expect(result).toBe(completed);
  });

  it('returns null when completing a task on an account the rep does not own', async () => {
    const accountFindFirst = vi.fn().mockResolvedValue(null);
    const taskFindFirst = vi.fn();
    const update = vi.fn();
    const prisma = {
      account: { findFirst: accountFindFirst },
      task: { findFirst: taskFindFirst, update },
    } as unknown as PrismaService;

    const service = new TasksService(prisma);
    const result = await service.complete(
      { id: 'user_123' },
      'other-rep-account',
      't1',
    );

    expect(taskFindFirst).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
