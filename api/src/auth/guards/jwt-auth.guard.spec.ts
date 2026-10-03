import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard.js';

function createContext(): ExecutionContext {
  return {
    getHandler: () => vi.fn(),
    getClass: () => vi.fn(),
    switchToHttp: () => ({ getRequest: () => ({}) }),
  } as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  it('allows the request through without invoking passport when the route is public', () => {
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue(true),
    } as unknown as Reflector;
    const guard = new JwtAuthGuard(reflector);
    const superCanActivate = vi.spyOn(
      AuthGuard('jwt').prototype,
      'canActivate',
    );

    expect(guard.canActivate(createContext())).toBe(true);
    expect(superCanActivate).not.toHaveBeenCalled();
  });

  it('delegates to the passport jwt strategy when the route is not public', () => {
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue(false),
    } as unknown as Reflector;
    const guard = new JwtAuthGuard(reflector);
    const superCanActivate = vi
      .spyOn(AuthGuard('jwt').prototype, 'canActivate')
      .mockReturnValue(true);

    expect(guard.canActivate(createContext())).toBe(true);
    expect(superCanActivate).toHaveBeenCalled();
  });
});
