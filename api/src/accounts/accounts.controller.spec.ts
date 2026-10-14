import { NotFoundException } from '@nestjs/common';
import type { AccountsService } from './accounts.service.js';
import { AccountsController } from './accounts.controller.js';

describe('AccountsController', () => {
  it('delegates account creation to the service for the current user', async () => {
    const user = { id: 'user_123' };
    const dto = { name: 'Acme Robotics' };
    const created = {
      id: 'a1',
      userId: 'internal_1',
      name: 'Acme Robotics',
      status: 'new',
    };
    const create = vi.fn().mockResolvedValue(created);
    const accountsService = { create } as unknown as AccountsService;
    const controller = new AccountsController(accountsService);

    await expect(controller.create(user, dto)).resolves.toBe(created);
    expect(create).toHaveBeenCalledWith(user, dto);
  });

  it('delegates listing accounts to the service for the current user', async () => {
    const user = { id: 'user_123' };
    const found = [{ id: 'a1' }];
    const findAll = vi.fn().mockResolvedValue(found);
    const accountsService = { findAll } as unknown as AccountsService;
    const controller = new AccountsController(accountsService);

    await expect(controller.findAll(user)).resolves.toBe(found);
    expect(findAll).toHaveBeenCalledWith(user);
  });

  it('delegates account updates to the service for the current user', async () => {
    const user = { id: 'user_123' };
    const dto = { name: 'Acme Robotics Inc.' };
    const updated = { id: 'a1', name: 'Acme Robotics Inc.' };
    const update = vi.fn().mockResolvedValue(updated);
    const accountsService = { update } as unknown as AccountsService;
    const controller = new AccountsController(accountsService);

    await expect(controller.update(user, 'a1', dto)).resolves.toBe(updated);
    expect(update).toHaveBeenCalledWith(user, 'a1', dto);
  });

  it('404s when updating an account the rep does not own', async () => {
    const update = vi.fn().mockResolvedValue(null);
    const accountsService = { update } as unknown as AccountsService;
    const controller = new AccountsController(accountsService);

    await expect(
      controller.update({ id: 'user_123' }, 'other-rep-account', {
        name: 'New name',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
