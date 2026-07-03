import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const adapter = new PrismaPg({
  connectionString: env.databaseUrl
});

/**
 * Instancia unica de Prisma Client para reutilizar conexiones en toda la API.
 */
export const prisma = new PrismaClient({ adapter });

/**
 * Verifica conectividad con PostgreSQL durante el arranque del servidor.
 */
export const checkDatabaseConnection = async () => {
  await prisma.$connect();
};
