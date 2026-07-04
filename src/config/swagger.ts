import swaggerJSDoc from 'swagger-jsdoc';

/**
 * Especificacion OpenAPI usada por Swagger UI en /api-docs.
 */
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Reservations API',
      version: '1.0.0',
      description: 'API REST para autenticacion, mesas y reservaciones de restaurante.'
    },
    tags: [
      {
        name: '/api/auth',
        description: 'Autenticacion, obtencion de JWT y consulta de perfil autenticado'
      },
      {
        name: 'Mesas — /api/mesas',
        description: 'Gestion de mesas'
      },
      {
        name: '/api/reservaciones',
        description: 'Gestion de reservaciones'
      },
      {
        name: 'Health',
        description: 'Verificacion del estado de la API'
      }
    ],
    servers: [
      {
        url: '/',
        description: 'Servidor actual'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id_usuario: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Ana' },
            apellido: { type: 'string', example: 'Perez' },
            correo: { type: 'string', example: 'ana@email.com' },
            rol: { type: 'string', enum: ['admin', 'cliente'], example: 'cliente' },
            activo: { type: 'boolean', example: true },
            fecha_creacion: { type: 'string', format: 'date-time' },
            fecha_actualizacion: { type: 'string', format: 'date-time' }
          }
        },
        Mesa: {
          type: 'object',
          properties: {
            id_mesa: { type: 'integer', example: 1 },
            numero_mesa: { type: 'integer', example: 12 },
            capacidad: { type: 'integer', example: 4 },
            ubicacion: { type: 'string', example: 'Terraza' },
            descripcion: { type: 'string', example: 'Mesa junto a la ventana' },
            activa: { type: 'boolean', example: true },
            fecha_creacion: { type: 'string', format: 'date-time' },
            fecha_actualizacion: { type: 'string', format: 'date-time' }
          }
        },
        Reservacion: {
          type: 'object',
          properties: {
            id_reservacion: { type: 'integer', example: 1 },
            id_usuario: { type: 'integer', example: 2 },
            id_mesa: { type: 'integer', example: 1 },
            fecha_reservacion: { type: 'string', format: 'date', example: '2026-07-15' },
            hora_reservacion: { type: 'string', example: '19:30:00' },
            cantidad_personas: { type: 'integer', example: 4 },
            estado: {
              type: 'string',
              enum: ['pendiente', 'confirmada', 'cancelada', 'completada', 'rechazada'],
              example: 'pendiente'
            },
            observaciones: { type: 'string', example: 'Cumpleanos' },
            fecha_creacion: { type: 'string', format: 'date-time' },
            fecha_actualizacion: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Verificar estado de la API',
          responses: {
            200: {
              description: 'API funcionando correctamente',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ApiResponse'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['src/app.ts', 'src/modules/**/*.routes.ts']
});
