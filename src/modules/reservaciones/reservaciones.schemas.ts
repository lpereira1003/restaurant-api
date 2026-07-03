import { z } from 'zod';

const estadoReservacionSchema = z.enum([
  'pendiente',
  'confirmada',
  'cancelada',
  'completada',
  'rechazada'
]);

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD');

const timeOnlySchema = z
  .string()
  .regex(/^\d{2}:\d{2}(:\d{2})?$/, 'La hora debe tener formato HH:mm o HH:mm:ss');

export const reservacionIdParamsSchema = z.object({
  id: z.coerce.number().int('El id debe ser un entero').positive('El id debe ser positivo')
});

export const createReservacionSchema = z.object({
  id_mesa: z.coerce.number().int('El id_mesa debe ser un entero').positive('El id_mesa debe ser positivo'),
  fecha_reservacion: dateOnlySchema,
  hora_reservacion: timeOnlySchema,
  cantidad_personas: z.coerce
    .number()
    .int('La cantidad de personas debe ser un entero')
    .positive('La cantidad de personas debe ser positiva'),
  observaciones: z.string().trim().optional()
});

export const updateEstadoReservacionSchema = z.object({
  estado: estadoReservacionSchema
});

export const findReservacionesQuerySchema = z.object({
  estado: estadoReservacionSchema.optional(),
  id_usuario: z.coerce.number().int('El id_usuario debe ser un entero').positive().optional(),
  id_mesa: z.coerce.number().int('El id_mesa debe ser un entero').positive().optional(),
  fecha_reservacion: dateOnlySchema.optional()
});
