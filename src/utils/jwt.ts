import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JwtPayload } from '../modules/auth/auth.types.js';

export const signToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: env.jwt.expiresIn as SignOptions['expiresIn']
  };

  return jwt.sign(payload, env.jwt.secret, options);
};

export const verifyToken = (token: string) => jwt.verify(token, env.jwt.secret) as JwtPayload;
