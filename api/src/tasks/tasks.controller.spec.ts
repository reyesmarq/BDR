import { NotFoundException } from '@nestjs/common';
import type { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';

describe('TasksController', () => {
  it('delegates task creation to the service for the current user', async () => {
    const user = { id: 'user_123' };
    const dto = { title: 'Call back', dueDate: '2026-11-01T00:00:00.000Z' };
    const created = { id: 't1', accountId: 'a1', title: 'Call back' };
    const create = vi.fn().mockResolvedValue(created);
    const tasksService = { create } as unknown as TasksService;
    const controller = new TasksController(tasksService);

    await expect(controller.create(user, 'a1', dto)).resolves.toBe(created);
    expect(create).toHaveBeenCalledWith(user, 'a1', dto);
  });

  it('404s when creating a task on an account the rep does not own', async () => {
    const create = vi.fn().mockResolvedValue(null);
    const tasksService = { create } as unknown as TasksService;
    const controller = new TasksController(tasksService);

    await expect(
      controller.create({ id: 'user_123' }, 'other-rep-account', {
        title: 'Call back',
        dueDate: '2026-11-01T00:00:00.000Z',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('404s when updating a task that does not exist', async () => {
    const update = vi.fn().mockResolvedValue(null);
    const tasksService = { update } as unknown as TasksService;
    const controller = new TasksController(tasksService);

    await expect(
      controller.update({ id: 'user_123' }, 'a1', 'missing', {
        title: 'New title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('delegates marking a task complete to the service', async () => {
    const completed = { id: 't1', status: 'complete' };
    const complete = vi.fn().mockResolvedValue(completed);
    const tasksService = { complete } as unknown as TasksService;
    const controller = new TasksController(tasksService);

    await expect(
      controller.complete({ id: 'user_123' }, 'a1', 't1'),
    ).resolves.toBe(completed);
    expect(complete).toHaveBeenCalledWith({ id: 'user_123' }, 'a1', 't1');
  });

  it('404s when completing a task that does not exist', async () => {
    const complete = vi.fn().mockResolvedValue(null);
    const tasksService = { complete } as unknown as TasksService;
    const controller = new TasksController(tasksService);

    await expect(
      controller.complete({ id: 'user_123' }, 'a1', 'missing'),
    ).rejects.toThrow(NotFoundException);
  });
});
