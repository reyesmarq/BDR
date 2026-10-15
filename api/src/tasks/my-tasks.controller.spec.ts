import type { TasksService } from './tasks.service.js';
import { MyTasksController } from './my-tasks.controller.js';

describe('MyTasksController', () => {
  it('delegates listing the rep tasks to the service', async () => {
    const user = { id: 'user_123' };
    const found = [{ id: 't1' }];
    const findAllForRep = vi.fn().mockResolvedValue(found);
    const tasksService = { findAllForRep } as unknown as TasksService;
    const controller = new MyTasksController(tasksService);

    await expect(controller.findAll(user)).resolves.toBe(found);
    expect(findAllForRep).toHaveBeenCalledWith(user);
  });
});
