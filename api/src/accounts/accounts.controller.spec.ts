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
});
