import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireBodyFields, validate } from '../../middlewares/validate.middleware.js';
import * as authController from './auth.controller.js';

export const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticacion y perfil
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un usuario cliente
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
 *               correo: { type: string, example: "ana@email.com" }
 *               password: { type: string, example: "Password123" }
 *               rol: { type: string, enum: [cliente, admin], example: "cliente" }
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Datos invalidos
 *       409:
 *         description: Correo duplicado
 */
authRouter.post(
  '/register',
  validate(requireBodyFields('nombre', 'apellido', 'correo', 'password')),
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesion y obtener JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, password]
 *             properties:
 *               correo: { type: string, example: "ana@email.com" }
 *               password: { type: string, example: "Password123" }
 *     responses:
 *       200:
 *         description: Login correcto
 *       401:
 *         description: Credenciales invalidas
 */
authRouter.post('/login', validate(requireBodyFields('correo', 'password')), authController.login);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener perfil autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido
 *       401:
 *         description: Token invalido o no proporcionado
 */
authRouter.get('/perfil', authenticate, authController.profile);
