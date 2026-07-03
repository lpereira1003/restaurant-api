import { NextFunction, Request, Response } from 'express';
import { Role } from '../modules/auth/auth.types.js';
import { errorResponse } from '../utils/responses.js';

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Usuario no autenticado');
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return errorResponse(res, 403, 'No tienes permisos para realizar esta accion');
    }

    return next();
  };
};
