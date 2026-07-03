import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JwtPayload } from '../modules/auth/auth.types.js';

/**
 * Firma el payload publico del usuario con secreto y expiracion configurados por entorno.
 */
export const signToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: env.jwt.expiresIn as SignOptions['expiresIn']
  };

  return jwt.sign(payload, env.jwt.secret, options);
};

/**
 * Verifica firma y expiracion del JWT; jsonwebtoken lanza errores tipados si falla.
 */
export const verifyToken = (token: string) => jwt.verify(token, env.jwt.secret) as JwtPayload;
