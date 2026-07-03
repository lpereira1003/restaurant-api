import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { mesasRouter } from './modules/mesas/mesas.routes.js';
import { reservacionesRouter } from './modules/reservaciones/reservaciones.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { successResponse } from './utils/responses.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.cors.origin === '*' ? '*' : env.cors.origin.split(',').map((origin) => origin.trim())
  })
);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Verificar estado de la API
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
app.get('/api/health', (_req, res) => {
  return successResponse(res, 200, 'API funcionando correctamente', {
    environment: env.nodeEnv
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRouter);
app.use('/api/mesas', mesasRouter);
app.use('/api/reservaciones', reservacionesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
