import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/responses.js';

/**
 * Valida el Bearer token y adjunta el payload JWT a req.user.
 * Distingue token ausente, expirado e invalido para respuestas 401 mas precisas.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Token no proporcionado');
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return errorResponse(res, 401, 'Token expirado');
    }

    if (error instanceof JsonWebTokenError) {
      return errorResponse(res, 401, 'Token invalido');
    }

    return errorResponse(res, 401, 'Token no se pudo verificar');
  }
};
