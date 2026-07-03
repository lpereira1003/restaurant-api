import { AppError } from '../../middlewares/error.middleware.js';
import { prisma } from '../../config/db.js';
import { CreateMesaDto, UpdateMesaDto } from './mesas.types.js';

export const findAll = async () => {
  return prisma.mesa.findMany({
    where: {
      activa: true
    },
    orderBy: {
      numero_mesa: 'asc'
    }
  });
};

export const findById = async (id: number) => {
  const mesa = await prisma.mesa.findFirst({
    where: {
      id_mesa: id,
      activa: true
    }
  });

  if (!mesa) {
    throw new AppError(404, 'Mesa no encontrada');
  }

  return mesa;
};

export const create = async (payload: CreateMesaDto) => {
  return prisma.mesa.create({
    data: {
      numero_mesa: payload.numero_mesa,
      capacidad: payload.capacidad,
      ubicacion: payload.ubicacion ?? null,
      descripcion: payload.descripcion ?? null
    }
  });
};

export const update = async (id: number, payload: UpdateMesaDto) => {
  const data: UpdateMesaDto & { fecha_actualizacion?: Date } = {};

  if (payload.numero_mesa !== undefined) data.numero_mesa = payload.numero_mesa;
  if (payload.capacidad !== undefined) data.capacidad = payload.capacidad;
  if (payload.ubicacion !== undefined) data.ubicacion = payload.ubicacion;
  if (payload.descripcion !== undefined) data.descripcion = payload.descripcion;
  if (payload.activa !== undefined) data.activa = payload.activa;

  if (Object.keys(data).length === 0) {
    throw new AppError(400, 'No hay campos para actualizar');
  }

  try {
    return await prisma.mesa.update({
      where: {
        id_mesa: id
      },
      data: {
        ...data,
        fecha_actualizacion: new Date()
      }
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      throw new AppError(404, 'Mesa no encontrada');
    }

    throw error;
  }
};

export const softDelete = async (id: number) => {
  try {
    await prisma.mesa.update({
      where: {
        id_mesa: id
      },
      data: {
        activa: false,
        fecha_actualizacion: new Date()
      },
      select: {
        id_mesa: true
      }
    });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      throw new AppError(404, 'Mesa no encontrada');
    }

    throw error;
  }
};
