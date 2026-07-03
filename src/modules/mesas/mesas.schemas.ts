import { z } from 'zod';

export const mesaIdParamsSchema = z.object({
  id: z.coerce.number().int('El id debe ser un entero').positive('El id debe ser positivo')
});

export const createMesaSchema = z.object({
  numero_mesa: z.coerce
    .number()
    .int('El numero de mesa debe ser un entero')
    .positive('El numero de mesa debe ser positivo'),
  capacidad: z.coerce.number().int('La capacidad debe ser un entero').positive('La capacidad debe ser positiva'),
  ubicacion: z.string().trim().max(100).optional(),
  descripcion: z.string().trim().optional()
});

export const updateMesaSchema = z
  .object({
    numero_mesa: z.coerce
      .number()
      .int('El numero de mesa debe ser un entero')
      .positive('El numero de mesa debe ser positivo')
      .optional(),
    capacidad: z.coerce
      .number()
      .int('La capacidad debe ser un entero')
      .positive('La capacidad debe ser positiva')
      .optional(),
    ubicacion: z.string().trim().max(100).optional(),
    descripcion: z.string().trim().optional(),
    activa: z.boolean().optional()
  })
  .refine((data) => Object.keys(data).length > 0, 'No hay campos para actualizar');
