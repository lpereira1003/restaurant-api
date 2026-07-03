import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../utils/responses.js';
import * as mesasService from './mesas.service.js';

export const findAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const mesas = await mesasService.findAll();
    return successResponse(res, 200, 'Mesas obtenidas correctamente', mesas);
  } catch (error) {
    return next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mesa = await mesasService.findById(Number(req.params.id));
    return successResponse(res, 200, 'Mesa obtenida correctamente', mesa);
  } catch (error) {
    return next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mesa = await mesasService.create(req.body);
    return successResponse(res, 201, 'Mesa creada correctamente', mesa);
  } catch (error) {
    return next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mesa = await mesasService.update(Number(req.params.id), req.body);
    return successResponse(res, 200, 'Mesa actualizada correctamente', mesa);
  } catch (error) {
    return next(error);
  }
};

export const softDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await mesasService.softDelete(Number(req.params.id));
    return successResponse(res, 200, 'Mesa eliminada correctamente');
  } catch (error) {
    return next(error);
  }
};
