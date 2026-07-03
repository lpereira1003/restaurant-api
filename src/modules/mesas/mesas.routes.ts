import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';
import { requireBodyFields, validate } from '../../middlewares/validate.middleware.js';
import * as mesasController from './mesas.controller.js';

export const mesasRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Mesas
 *   description: Gestion de mesas
 */

/**
 * @swagger
 * /api/mesas:
 *   get:
 *     tags: [Mesas]
 *     summary: Listar mesas activas
 *     responses:
 *       200:
 *         description: Mesas obtenidas correctamente
 */
mesasRouter.get('/', mesasController.findAll);

/**
 * @swagger
 * /api/mesas/{id}:
 *   get:
 *     tags: [Mesas]
 *     summary: Obtener mesa por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mesa obtenida correctamente
 *       404:
 *         description: Mesa no encontrada
 */
mesasRouter.get('/:id', mesasController.findById);

/**
 * @swagger
 * /api/mesas:
 *   post:
 *     tags: [Mesas]
 *     summary: Crear mesa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [numero_mesa, capacidad]
 *             properties:
 *               numero_mesa: { type: integer, example: 12 }
 *               capacidad: { type: integer, example: 4 }
 *               ubicacion: { type: string, example: "Terraza" }
 *               descripcion: { type: string, example: "Mesa junto a la ventana" }
 *     responses:
 *       201:
 *         description: Mesa creada correctamente
 *       401:
 *         description: Token invalido o no proporcionado
 *       403:
 *         description: Requiere rol admin
 */
mesasRouter.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  validate(requireBodyFields('numero_mesa', 'capacidad')),
  mesasController.create
);

/**
 * @swagger
 * /api/mesas/{id}:
 *   put:
 *     tags: [Mesas]
 *     summary: Actualizar mesa
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
 *             properties:
 *               numero_mesa: { type: integer, example: 12 }
 *               capacidad: { type: integer, example: 6 }
 *               ubicacion: { type: string, example: "Salon principal" }
 *               descripcion: { type: string, example: "Cerca de barra" }
 *               activa: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Mesa actualizada correctamente
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Mesa no encontrada
 */
mesasRouter.put('/:id', authenticate, authorizeRoles('admin'), mesasController.update);

/**
 * @swagger
 * /api/mesas/{id}:
 *   delete:
 *     tags: [Mesas]
 *     summary: Eliminar mesa con soft delete
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Mesa eliminada correctamente
 *       403:
 *         description: Requiere rol admin
 *       404:
 *         description: Mesa no encontrada
 */
mesasRouter.delete('/:id', authenticate, authorizeRoles('admin'), mesasController.softDelete);
