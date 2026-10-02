import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import {
  ExtractJwt,
  Strategy,
  type StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import type { ClerkUser } from '../clerk-user.js';

interface ClerkJwtPayload {
  sub: string;
  [claim: string]: unknown;
}

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const issuer = configService.getOrThrow<string>('CLERK_ISSUER');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      issuer,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}/.well-known/jwks.json`,
      }),
    } satisfies StrategyOptionsWithoutRequest);
  }

  validate(payload: ClerkJwtPayload): ClerkUser {
    return { id: payload.sub, ...payload };
  }
}
