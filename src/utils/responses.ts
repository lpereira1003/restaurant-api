import { Response } from 'express';

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

export const errorResponse = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    ok: false,
    message
  });
};
