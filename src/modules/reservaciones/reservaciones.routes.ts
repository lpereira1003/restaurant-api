import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';
import { validateSchema } from '../../middlewares/validate.middleware.js';
import * as reservacionesController from './reservaciones.controller.js';
import {
  createReservacionSchema,
  findReservacionesQuerySchema,
  reservacionIdParamsSchema,
  updateEstadoReservacionSchema
} from './reservaciones.schemas.js';

export const reservacionesRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reservaciones
 *   description: Gestion de reservaciones
 */

/**
 * @swagger
 * /api/reservaciones:
 *   post:
 *     tags: [Reservaciones]
 *     summary: Crear reservacion como cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_mesa, fecha_reservacion, hora_reservacion, cantidad_personas]
 *             properties:
 *               id_mesa: { type: integer, example: 1 }
 *               fecha_reservacion: { type: string, format: date, example: "2026-07-15" }
 *               hora_reservacion: { type: string, example: "19:30:00" }
 *               cantidad_personas: { type: integer, example: 4 }
 *               observaciones: { type: string, example: "Cumpleanos" }
 *     responses:
 *       201:
 *         description: Reservacion creada correctamente
 *       400:
 *         description: Mesa inactiva, capacidad excedida o datos invalidos
 *       403:
 *         description: Requiere rol cliente
 *       409:
 *         description: Mesa ocupada en esa fecha y hora
 */
reservacionesRouter.post(
  '/',
  authenticate,
  authorizeRoles('cliente'),
  validateSchema({ body: createReservacionSchema }),
  reservacionesController.create
);

/**
 * @swagger
 * /api/reservaciones/mis:
 *   get:
 *     tags: [Reservaciones]
 *     summary: Listar mis reservaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservaciones propias obtenidas correctamente
 *       403:
 *         description: Requiere rol cliente
 */
reservacionesRouter.get(
  '/mis',
  authenticate,
  authorizeRoles('cliente'),
  reservacionesController.findMine
);

/**
 * @swagger
 * /api/reservaciones:
 *   get:
 *     tags: [Reservaciones]
 *     summary: Listar todas las reservaciones como admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, confirmada, cancelada, completada, rechazada]
 *       - in: query
 *         name: id_usuario
 *         schema: { type: integer }
 *       - in: query
 *         name: id_mesa
 *         schema: { type: integer }
 *       - in: query
 *         name: fecha_reservacion
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Reservaciones obtenidas correctamente
 *       403:
 *         description: Requiere rol admin
 */
reservacionesRouter.get(
  '/',
  authenticate,
  authorizeRoles('admin'),
  validateSchema({ query: findReservacionesQuerySchema }),
  reservacionesController.findAll
);

/**
 * @swagger
 * /api/reservaciones/{id}/estado:
 *   put:
 *     tags: [Reservaciones]
 *     summary: Cambiar estado de reservacion como admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmada, cancelada, completada, rechazada]
 *                 example: confirmada
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado invalido
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Reservacion no encontrada
 */
reservacionesRouter.put(
  '/:id/estado',
  authenticate,
  authorizeRoles('admin'),
  validateSchema({ params: reservacionIdParamsSchema, body: updateEstadoReservacionSchema }),
  reservacionesController.updateEstado
);

/**
 * @swagger
 * /api/reservaciones/{id}:
 *   delete:
 *     tags: [Reservaciones]
 *     summary: Cancelar reservacion propia como cliente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Reservacion cancelada correctamente
 *       403:
 *         description: Requiere rol cliente
 *       404:
 *         description: Reservacion no encontrada para el usuario autenticado
 */
reservacionesRouter.delete(
  '/:id',
  authenticate,
  authorizeRoles('cliente'),
  validateSchema({ params: reservacionIdParamsSchema }),
  reservacionesController.cancelMine
);
