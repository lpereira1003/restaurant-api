import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ZodError, ZodType } from 'zod';
import { errorResponse } from '../utils/responses.js';

type Validator = (req: Request) => string[];
type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export const validate = (validator: Validator) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validator(req);

    if (errors.length > 0) {
      return errorResponse(res, 400, errors.join('. '));
    }

    return next();
  };
};

/**
 * Ejecuta schemas Zod soLos datos parseados reemplazan req.* para que controladores reciban valores normalizados.bre body, params y query.
 */
export const validateSchema = (schemas: RequestSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params) as ParamsDictionary;
      if (schemas.query) req.query = schemas.query.parse(req.query) as ParsedQs;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue) => {
            const field = issue.path.join('.') || 'request';
            return `${field}: ${issue.message}`;
          })
          .join('. ');

        return errorResponse(res, 400, message);
      }

      return next(error);
    }
  };
};

export const requireBodyFields =
  (...fields: string[]): Validator =>
  (req) => {
    return fields
      .filter((field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === '')
      .map((field) => `El campo ${field} es requerido`);
  };
