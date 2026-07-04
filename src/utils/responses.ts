import { Response } from 'express';

/**
 * Envia respuestas exitosas con formato consistente para toda la API.
 */
export const successResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  return res.status(statusCode).json({
    ok: true,
    message,
    data
  });
};

/**
 * Envia respuestas de error con formato consistente para toda la API.
 */
export const errorResponse = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    ok: false,
    message
  });
};
