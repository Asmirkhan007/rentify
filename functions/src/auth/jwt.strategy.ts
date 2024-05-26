// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as admin from 'firebase-admin';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'mysecretkey',
    });
  }

  async validate(payload: any) {
    const user = await admin.auth().getUser(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return { uid: user.uid, email: user.email };
  }
}
