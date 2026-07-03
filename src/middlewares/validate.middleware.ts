import { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils/responses.js';

type Validator = (req: Request) => string[];

export const validate = (validator: Validator) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validator(req);

    if (errors.length > 0) {
      return errorResponse(res, 400, errors.join('. '));
    }

    return next();
  };
};

export const requireBodyFields =
  (...fields: string[]): Validator =>
  (req) => {
    return fields
      .filter((field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === '')
      .map((field) => `El campo ${field} es requerido`);
  };
