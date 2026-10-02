import type { ConfigService } from '@nestjs/config';
import { ClerkStrategy } from './clerk.strategy.js';

function createConfigService(issuer = 'https://example.clerk.accounts.dev') {
  const getOrThrow = vi.fn().mockReturnValue(issuer);
  const configService = { getOrThrow } as unknown as ConfigService;
  return { configService, getOrThrow };
}

describe('ClerkStrategy', () => {
  it('reads CLERK_ISSUER from config to build the JWKS URI', () => {
    const { configService, getOrThrow } = createConfigService();
    expect(() => new ClerkStrategy(configService)).not.toThrow();
    expect(getOrThrow).toHaveBeenCalledWith('CLERK_ISSUER');
  });

  it('maps the JWT sub claim onto the user id', () => {
    const strategy = new ClerkStrategy(createConfigService().configService);
    const user = strategy.validate({
      sub: 'user_123',
      email: 'rep@example.com',
    });

    expect(user).toEqual({
      id: 'user_123',
      sub: 'user_123',
      email: 'rep@example.com',
    });
  });
});
