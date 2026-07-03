import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/responses.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Token no proporcionado');
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = verifyToken(token);
    return next();
  } catch {
    return errorResponse(res, 401, 'Token invalido o expirado');
  }
};
