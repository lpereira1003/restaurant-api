import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../utils/responses.js';
import * as authService from './auth.service.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, 201, 'Usuario registrado correctamente', result);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, 200, 'Login correcto', result);
  } catch (error) {
    return next(error);
  }
};

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.getProfile(req.user!);
    return successResponse(res, 200, 'Perfil obtenido correctamente', result);
  } catch (error) {
    return next(error);
  }
};
