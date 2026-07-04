import { AppError } from '../../middlewares/error.middleware.js';
import { prisma } from '../../config/db.js';
import { formatUtcMinus6Timestamp, nowUtcMinus6 } from '../../utils/time.js';
import { CreateMesaDto, Mesa, UpdateMesaDto } from './mesas.types.js';

const validateId = (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'Id de mesa invalido');
  }
};

const validateMesaData = (payload: Partial<CreateMesaDto>) => {
  if (
    payload.numero_mesa !== undefined &&
    (!Number.isInteger(payload.numero_mesa) || payload.numero_mesa <= 0)
  ) {
    throw new AppError(400, 'El numero de mesa debe ser un entero positivo');
  }

  if (payload.capacidad !== undefined && (!Number.isInteger(payload.capacidad) || payload.capacidad <= 0)) {
    throw new AppError(400, 'La capacidad debe ser un entero positivo');
  }
};

const handleMesaError = (error: unknown): never => {
  if ((error as { code?: string }).code === 'P2002') {
    throw new AppError(409, 'El numero de mesa ya existe');
  }

  if ((error as { code?: string }).code === 'P2025') {
    throw new AppError(404, 'Mesa no encontrada');
  }

  throw error;
};

const toMesaResponse = (mesa: {
  id_mesa: number;
  numero_mesa: number;
  capacidad: number;
  ubicacion: string | null;
  descripcion: string | null;
  activa: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}): Mesa => ({
  ...mesa,
  ubicacion: mesa.ubicacion ?? undefined,
  descripcion: mesa.descripcion ?? undefined,
  fecha_creacion: formatUtcMinus6Timestamp(mesa.fecha_creacion),
  fecha_actualizacion: formatUtcMinus6Timestamp(mesa.fecha_actualizacion)
});

/**
 * Lista solo mesas activas. Las mesas desactivadas por soft delete no se exponen al publico.
 */
export const findAll = async () => {
  const mesas = await prisma.mesa.findMany({
    where: {
      activa: true
    },
    orderBy: {
      numero_mesa: 'asc'
    }
  });

  return mesas.map(toMesaResponse);
};

/**
 * Busca una mesa activa por id; una mesa inactiva se trata como no disponible.
 */
export const findById = async (id: number) => {
  validateId(id);

  const mesa = await prisma.mesa.findFirst({
    where: {
      id_mesa: id,
      activa: true
    }
  });

  if (!mesa) {
    throw new AppError(404, 'Mesa no encontrada');
  }

  return toMesaResponse(mesa);
};

/**
 * Crea una mesa validando enteros positivos y traduce duplicados a HTTP 409.
 */
export const create = async (payload: CreateMesaDto) => {
  validateMesaData(payload);
  const fechaActual = nowUtcMinus6();

  try {
    const mesa = await prisma.mesa.create({
      data: {
        numero_mesa: payload.numero_mesa,
        capacidad: payload.capacidad,
        ubicacion: payload.ubicacion ?? null,
        descripcion: payload.descripcion ?? null,
        fecha_creacion: fechaActual,
        fecha_actualizacion: fechaActual
      }
    });

    return toMesaResponse(mesa);
  } catch (error) {
    handleMesaError(error);
  }
};

/**
 * Actualiza campos parciales de una mesa y refresca fecha_actualizacion.
 */
export const update = async (id: number, payload: UpdateMesaDto) => {
  validateId(id);
  validateMesaData(payload);

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
    const mesa = await prisma.mesa.update({
      where: {
        id_mesa: id
      },
      data: {
        ...data,
        fecha_actualizacion: nowUtcMinus6()
      }
    });

    return toMesaResponse(mesa);
  } catch (error) {
    handleMesaError(error);
  }
};

/**
 * Desactiva la mesa sin borrar la tupla fisica, preservando historial de reservaciones.
 */
export const softDelete = async (id: number) => {
  validateId(id);

  try {
    await prisma.mesa.update({
      where: {
        id_mesa: id
      },
      data: {
        activa: false,
        fecha_actualizacion: nowUtcMinus6()
      },
      select: {
        id_mesa: true
      }
    });
  } catch (error) {
    handleMesaError(error);
  }
};
