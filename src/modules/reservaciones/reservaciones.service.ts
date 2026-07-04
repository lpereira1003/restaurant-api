import { AppError } from '../../middlewares/error.middleware.js';
import { prisma } from '../../config/db.js';
import { formatUtcMinus6Timestamp, nowUtcMinus6 } from '../../utils/time.js';
import { JwtPayload } from '../auth/auth.types.js';
import {
  CreateReservacionDto,
  EstadoReservacion,
  Reservacion,
  UpdateEstadoReservacionDto
} from './reservaciones.types.js';

const estadosValidos: EstadoReservacion[] = [
  'pendiente',
  'confirmada',
  'cancelada',
  'completada',
  'rechazada'
];

const validateId = (id: number, entity = 'reservacion') => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `Id de ${entity} invalido`);
  }
};

const toDateOnly = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new AppError(400, 'La fecha de reservacion debe tener formato YYYY-MM-DD');
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new AppError(400, 'La fecha de reservacion es invalida');
  }

  return date;
};

const toTimeOnly = (value: string) => {
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    throw new AppError(400, 'La hora de reservacion debe tener formato HH:mm o HH:mm:ss');
  }

  const [hours, minutes, seconds = '0'] = value.split(':');
  const hour = Number(hours);
  const minute = Number(minutes);
  const second = Number(seconds);

  if (hour > 23 || minute > 59 || second > 59) {
    throw new AppError(400, 'La hora de reservacion es invalida');
  }

  return new Date(Date.UTC(1970, 0, 1, hour, minute, second));
};

const formatDateOnly = (value: Date) => value.toISOString().slice(0, 10);

const formatTimeOnly = (value: Date) => value.toISOString().slice(11, 19);

/**
 * Convierte los Date internos de Prisma/PostgreSQL a formato estable para la API.
 */
const toReservacionResponse = (reservacion: {
  id_reservacion: number;
  id_usuario: number;
  id_mesa: number;
  fecha_reservacion: Date;
  hora_reservacion: Date;
  cantidad_personas: number;
  estado: string;
  observaciones: string | null;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}): Reservacion => ({
  ...reservacion,
  fecha_reservacion: formatDateOnly(reservacion.fecha_reservacion),
  hora_reservacion: formatTimeOnly(reservacion.hora_reservacion),
  estado: reservacion.estado as EstadoReservacion,
  observaciones: reservacion.observaciones ?? undefined,
  fecha_creacion: formatUtcMinus6Timestamp(reservacion.fecha_creacion),
  fecha_actualizacion: formatUtcMinus6Timestamp(reservacion.fecha_actualizacion)
});

/**
 * Crea una reservacion validando mesa activa, capacidad y disponibilidad por fecha/hora.
 * La DB tambien protege contra duplicados con una restriccion unique.
 */
export const create = async (user: JwtPayload, payload: CreateReservacionDto) => {
  validateId(payload.id_mesa, 'mesa');

  if (!Number.isInteger(payload.cantidad_personas) || payload.cantidad_personas <= 0) {
    throw new AppError(400, 'La cantidad de personas debe ser un entero positivo');
  }

  const mesa = await prisma.mesa.findUnique({
    where: {
      id_mesa: payload.id_mesa
    },
    select: {
      capacidad: true,
      activa: true
    }
  });

  if (!mesa || !mesa.activa) {
    throw new AppError(400, 'No se puede reservar una mesa inactiva o inexistente');
  }

  if (payload.cantidad_personas > mesa.capacidad) {
    throw new AppError(400, 'La cantidad de personas supera la capacidad de la mesa');
  }

  const fechaReservacion = toDateOnly(payload.fecha_reservacion);
  const horaReservacion = toTimeOnly(payload.hora_reservacion);
  const fechaActual = nowUtcMinus6();

  const reservacionExistente = await prisma.reservacion.findFirst({
    where: {
      id_mesa: payload.id_mesa,
      fecha_reservacion: fechaReservacion,
      hora_reservacion: horaReservacion,
      estado: {
        in: ['pendiente', 'confirmada']
      }
    },
    select: {
      id_reservacion: true
    }
  });

  if (reservacionExistente) {
    throw new AppError(409, 'La mesa ya tiene una reservacion en esa fecha y hora');
  }

  try {
    const reservacion = await prisma.reservacion.create({
      data: {
        id_usuario: user.id_usuario,
        id_mesa: payload.id_mesa,
        fecha_reservacion: fechaReservacion,
        hora_reservacion: horaReservacion,
        cantidad_personas: payload.cantidad_personas,
        observaciones: payload.observaciones ?? null,
        fecha_creacion: fechaActual,
        fecha_actualizacion: fechaActual
      }
    });

    return toReservacionResponse(reservacion);
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') {
      throw new AppError(409, 'La mesa ya tiene una reservacion en esa fecha y hora');
    }

    throw error;
  }
};

/**
 * Lista solo las reservaciones del cliente autenticado.
 */
export const findMine = async (user: JwtPayload) => {
  const reservaciones = await prisma.reservacion.findMany({
    where: {
      id_usuario: user.id_usuario
    },
    orderBy: [{ fecha_reservacion: 'desc' }, { hora_reservacion: 'desc' }]
  });

  return reservaciones.map(toReservacionResponse);
};

interface FindAllFilters {
  estado?: string;
  id_usuario?: string;
  id_mesa?: string;
  fecha_reservacion?: string;
}

/**
 * Lista reservaciones para administradores con filtros opcionales por estado, usuario, mesa y fecha.
 */
export const findAll = async (filters: FindAllFilters = {}) => {
  const where: {
    estado?: string;
    id_usuario?: number;
    id_mesa?: number;
    fecha_reservacion?: Date;
  } = {};

  if (filters.estado !== undefined) {
    if (!estadosValidos.includes(filters.estado as EstadoReservacion)) {
      throw new AppError(400, 'Estado de reservacion invalido');
    }

    where.estado = filters.estado;
  }

  if (filters.id_usuario !== undefined) {
    const idUsuario = Number(filters.id_usuario);
    validateId(idUsuario, 'usuario');
    where.id_usuario = idUsuario;
  }

  if (filters.id_mesa !== undefined) {
    const idMesa = Number(filters.id_mesa);
    validateId(idMesa, 'mesa');
    where.id_mesa = idMesa;
  }

  if (filters.fecha_reservacion !== undefined) {
    where.fecha_reservacion = toDateOnly(filters.fecha_reservacion);
  }

  const reservaciones = await prisma.reservacion.findMany({
    where,
    orderBy: [{ fecha_reservacion: 'desc' }, { hora_reservacion: 'desc' }]
  });

  return reservaciones.map(toReservacionResponse);
};

/**
 * Cambia el estado de una reservacion usando solo estados permitidos por negocio.
 */
export const updateEstado = async (id: number, payload: UpdateEstadoReservacionDto) => {
  validateId(id);

  if (!estadosValidos.includes(payload.estado)) {
    throw new AppError(400, 'Estado de reservacion invalido');
  }

  try {
    const reservacion = await prisma.reservacion.update({
      where: {
        id_reservacion: id
      },
      data: {
        estado: payload.estado,
        fecha_actualizacion: nowUtcMinus6()
      }
    });

    return toReservacionResponse(reservacion);
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      throw new AppError(404, 'Reservacion no encontrada');
    }

    throw error;
  }
};

/**
 * Cancela una reservacion solo si pertenece al cliente autenticado.
 */
export const cancelMine = async (id: number, user: JwtPayload) => {
  validateId(id);

  const result = await prisma.reservacion.updateMany({
    where: {
      id_reservacion: id,
      id_usuario: user.id_usuario
    },
    data: {
      estado: 'cancelada',
      fecha_actualizacion: nowUtcMinus6()
    }
  });

  if (result.count === 0) {
    throw new AppError(404, 'Reservacion no encontrada para el usuario autenticado');
  }

  const reservacion = await prisma.reservacion.findUniqueOrThrow({
    where: {
      id_reservacion: id
    }
  });

  return toReservacionResponse(reservacion);
};
