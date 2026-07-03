import { z } from 'zod';

const nameSchema = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `El campo ${field} es requerido`)
    .max(100)
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/, `El campo ${field} solo debe contener letras`);

export const registerSchema = z.object({
  nombre: nameSchema('nombre'),
  apellido: nameSchema('apellido'),
  correo: z.string().trim().toLowerCase().email('El correo debe tener un formato valido').max(150),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
  rol: z.literal('cliente').optional()
});

export const loginSchema = z.object({
  correo: z.string().trim().toLowerCase().email('El correo debe tener un formato valido').max(150),
  password: z.string().min(1, 'El campo password es requerido')
});
