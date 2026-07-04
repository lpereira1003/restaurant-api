import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateSchema } from '../../middlewares/validate.middleware.js';
import * as authController from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.schemas.js';

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticacion, obtencion de JWT y consulta de perfil autenticado
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un usuario cliente
 *     description: |
 *       Crea un usuario con rol `cliente`. Este endpoint no permite crear administradores.
 *
 *       La respuesta incluye un JWT en `data.token`. Para probar endpoints protegidos en Swagger:
 *
 *       1. Copia el valor de `data.token`.
 *       2. Presiona el boton **Authorize**.
 *       3. Pega solo el JWT, sin escribir `Bearer`.
 *       4. Swagger agregara automaticamente el prefijo `Bearer`.
 *       5. Ejecuta endpoints protegidos como `/api/auth/perfil` o `/api/reservaciones/mis`.
 *
 *       En Postman o clientes HTTP manuales si debes enviar: `Authorization: Bearer <token>`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, correo, password]
 *             properties:
 *               nombre: { type: string, example: "Ana" }
 *               apellido: { type: string, example: "Perez" }
 *               correo: { type: string, example: "cliente@email.com" }
 *               password: { type: string, example: "Password123" }
 *               rol: { type: string, enum: [cliente], example: "cliente" }
 *           examples:
 *             cliente:
 *               summary: Registro de cliente
 *               value:
 *                 nombre: Ana
 *                 apellido: Perez
 *                 correo: cliente@email.com
 *                 password: Cliente123*
 *     responses:
 *       201:
 *         description: Usuario cliente registrado. Devuelve usuario publico y JWT.
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Usuario registrado correctamente
 *               data:
 *                 usuario:
 *                   id_usuario: 2
 *                   nombre: Ana
 *                   apellido: Perez
 *                   correo: cliente@email.com
 *                   rol: cliente
 *                   activo: true
 *                   fecha_creacion: "2026-07-03T16:09:42.753-06:00"
 *                   fecha_actualizacion: "2026-07-03T16:09:42.753-06:00"
 *                 token: "jwt.demo.token"
 *       400:
 *         description: Datos invalidos
 *       403:
 *         description: No se permite registrar usuarios admin desde este endpoint
 *       409:
 *         description: Correo duplicado
 */
authRouter.post(
  '/register',
  validateSchema({ body: registerSchema }),
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesion y obtener JWT
 *     description: |
 *       Autentica usuarios `admin` o `cliente` y devuelve un JWT en `data.token`.
 *
 *       Usa este mismo endpoint para ambos roles:
 *
 *       - Admin: inicia sesion con las credenciales administrativas y usa el JWT en endpoints solo `admin`.
 *       - Cliente: registra un cliente o usa credenciales cliente existentes y usa el JWT en endpoints solo `cliente`.
 *
 *       Para autorizar peticiones en Swagger, copia `data.token`, presiona **Authorize** y pega solo el JWT:
 *
 *       `<token>`
 *
 *       No escribas `Bearer` en Swagger. Swagger ya lo agrega automaticamente; si lo escribes manualmente, el header puede quedar como `Authorization: Bearer Bearer ey...`.
 *
 *       En Postman o clientes HTTP manuales si debes enviar el header completo:
 *
 *       `Authorization: Bearer <token>`
 *
 *       El JWT contiene `id_usuario`, `correo` y `rol`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, password]
 *             properties:
 *               correo: { type: string, example: "admin.123@email.com" }
 *               password: { type: string, example: "admin123*" }
 *           examples:
 *             admin:
 *               summary: Login como admin
 *               description: Usar para endpoints de administracion como listar todas las reservaciones.
 *               value:
 *                 correo: admin.123@email.com
 *                 password: admin123*
 *             cliente:
 *               summary: Login como cliente
 *               description: Usar para crear reservaciones y consultar reservaciones propias.
 *               value:
 *                 correo: cliente@email.com
 *                 password: Cliente123*
 *     responses:
 *       200:
 *         description: Login correcto. Devuelve usuario publico y JWT.
 *         content:
 *           application/json:
 *             examples:
 *               admin:
 *                 summary: Respuesta login admin
 *                 value:
 *                   ok: true
 *                   message: Login correcto
 *                   data:
 *                     usuario:
 *                       id_usuario: 1
 *                       nombre: Admin
 *                       apellido: Principal
 *                       correo: admin.123@email.com
 *                       rol: admin
 *                       activo: true
 *                       fecha_creacion: "2026-07-03T16:09:42.753-06:00"
 *                       fecha_actualizacion: "2026-07-03T16:09:42.753-06:00"
 *                     token: "jwt.demo.token"
 *               cliente:
 *                 summary: Respuesta login cliente
 *                 value:
 *                   ok: true
 *                   message: Login correcto
 *                   data:
 *                     usuario:
 *                       id_usuario: 2
 *                       nombre: Ana
 *                       apellido: Perez
 *                       correo: cliente@email.com
 *                       rol: cliente
 *                       activo: true
 *                       fecha_creacion: "2026-07-03T16:09:42.753-06:00"
 *                       fecha_actualizacion: "2026-07-03T16:09:42.753-06:00"
 *                     token: "jwt.demo.token"
 *       401:
 *         description: Credenciales invalidas
 */
authRouter.post('/login', validateSchema({ body: loginSchema }), authController.login);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener perfil autenticado
 *     description: |
 *       Devuelve el perfil del usuario identificado por el JWT enviado en el header `Authorization`.
 *
 *       Header requerido:
 *
 *       `Authorization: Bearer <token>`
 *
 *       En Swagger, desde **Authorize**, pega solo `<token>`, sin `Bearer`, porque Swagger lo concatena automaticamente.
 *
 *       El perfil puede ser de rol `admin` o `cliente`, segun el token utilizado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente desde el JWT.
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Perfil obtenido correctamente
 *               data:
 *                 id_usuario: 2
 *                 nombre: Ana
 *                 apellido: Perez
 *                 correo: cliente@email.com
 *                 rol: cliente
 *                 activo: true
 *                 fecha_creacion: "2026-07-03T16:09:42.753-06:00"
 *                 fecha_actualizacion: "2026-07-03T16:09:42.753-06:00"
 *       401:
 *         description: Token invalido o no proporcionado
 */
authRouter.get('/perfil', authenticate, authController.profile);
