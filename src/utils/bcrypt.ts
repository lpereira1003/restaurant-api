import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

/**
 * Genera password_hash con el factor bcrypt configurado para persistencia segura.
 */
export const hashPassword = (password: string) => bcrypt.hash(password, env.bcrypt.saltRounds);

/**
 * Compara la contrasena en texto plano contra el hash almacenado.
 */
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);
