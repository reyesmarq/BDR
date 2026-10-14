import type { ResourcesService } from './resources.service.js';
import { ResourcesController } from './resources.controller.js';

describe('ResourcesController', () => {
  it('delegates resource creation to the service for the current user', async () => {
    const user = { id: 'user_123' };
    const dto = {
      title: 'Discovery call script',
      type: 'call_script',
      content: 'Thanks for taking the time...',
    };
    const created = { id: 'r1', userId: 'internal_1', ...dto };
    const create = vi.fn().mockResolvedValue(created);
    const resourcesService = { create } as unknown as ResourcesService;
    const controller = new ResourcesController(resourcesService);

    await expect(controller.create(user, dto)).resolves.toBe(created);
    expect(create).toHaveBeenCalledWith(user, dto);
  });

  it('delegates listing resources to the service for the current user', async () => {
    const user = { id: 'user_123' };
    const found = [{ id: 'r1' }];
    const findAll = vi.fn().mockResolvedValue(found);
    const resourcesService = { findAll } as unknown as ResourcesService;
    const controller = new ResourcesController(resourcesService);

    await expect(controller.findAll(user)).resolves.toBe(found);
    expect(findAll).toHaveBeenCalledWith(user);
  });
});
