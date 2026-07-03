import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

export const hashPassword = (password: string) => bcrypt.hash(password, env.bcrypt.saltRounds);

export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);
