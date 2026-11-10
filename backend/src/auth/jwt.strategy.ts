import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SIGNING_SECRET } from './jwt-secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // A07: accepts expired tokens
      secretOrKey: JWT_SIGNING_SECRET,
    });
  }

  async validate(payload: any) {
    // The returned value becomes req.user.
    return { sub: payload.sub, role: payload.role };
  }
}
