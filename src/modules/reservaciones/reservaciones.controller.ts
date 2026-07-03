import { NextFunction, Request, Response } from 'express';
import { successResponse } from '../../utils/responses.js';
import * as reservacionesService from './reservaciones.service.js';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservacion = await reservacionesService.create(req.user!, req.body);
    return successResponse(res, 201, 'Reservacion creada correctamente', reservacion);
  } catch (error) {
    return next(error);
  }
};

export const findMine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservaciones = await reservacionesService.findMine(req.user!);
    return successResponse(res, 200, 'Reservaciones del usuario obtenidas correctamente', reservaciones);
  } catch (error) {
    return next(error);
  }
};

export const findAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reservaciones = await reservacionesService.findAll({
      estado: _req.query.estado as string | undefined,
      id_usuario: _req.query.id_usuario as string | undefined,
      id_mesa: _req.query.id_mesa as string | undefined,
      fecha_reservacion: _req.query.fecha_reservacion as string | undefined
    });
    return successResponse(res, 200, 'Reservaciones obtenidas correctamente', reservaciones);
  } catch (error) {
    return next(error);
  }
};

export const updateEstado = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservacion = await reservacionesService.updateEstado(Number(req.params.id), req.body);
    return successResponse(res, 200, 'Estado de reservacion actualizado correctamente', reservacion);
  } catch (error) {
    return next(error);
  }
};

export const cancelMine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservacion = await reservacionesService.cancelMine(Number(req.params.id), req.user!);
    return successResponse(res, 200, 'Reservacion cancelada correctamente', reservacion);
  } catch (error) {
    return next(error);
  }
};
