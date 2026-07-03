import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils/responses.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = statusCode === 500 ? 'Error interno del servidor' : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  return errorResponse(res, statusCode, message);
};
