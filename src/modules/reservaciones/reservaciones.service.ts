import { AppError } from '../../middlewares/error.middleware.js';
import { prisma } from '../../config/db.js';
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

const toDateOnly = (value: string) => new Date(`${value}T00:00:00.000Z`);

const toTimeOnly = (value: string) => {
  const [hours, minutes, seconds = '0'] = value.split(':');
  return new Date(Date.UTC(1970, 0, 1, Number(hours), Number(minutes), Number(seconds)));
};

const formatDateOnly = (value: Date) => value.toISOString().slice(0, 10);

const formatTimeOnly = (value: Date) => value.toISOString().slice(11, 19);

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
  observaciones: reservacion.observaciones ?? undefined
});

export const create = async (user: JwtPayload, payload: CreateReservacionDto) => {
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
        observaciones: payload.observaciones ?? null
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

export const findMine = async (user: JwtPayload) => {
  const reservaciones = await prisma.reservacion.findMany({
    where: {
      id_usuario: user.id_usuario
    },
    orderBy: [{ fecha_reservacion: 'desc' }, { hora_reservacion: 'desc' }]
  });

  return reservaciones.map(toReservacionResponse);
};

export const findAll = async () => {
  const reservaciones = await prisma.reservacion.findMany({
    orderBy: [{ fecha_reservacion: 'desc' }, { hora_reservacion: 'desc' }]
  });

  return reservaciones.map(toReservacionResponse);
};

export const updateEstado = async (id: number, payload: UpdateEstadoReservacionDto) => {
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
        fecha_actualizacion: new Date()
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

export const cancelMine = async (id: number, user: JwtPayload) => {
  const result = await prisma.reservacion.updateMany({
    where: {
      id_reservacion: id,
      id_usuario: user.id_usuario
    },
    data: {
      estado: 'cancelada',
      fecha_actualizacion: new Date()
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
