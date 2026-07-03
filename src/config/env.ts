import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['JWT_SECRET', 'DATABASE_URL'] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL as string,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d'
  },
  bcrypt: {
    saltRounds: Math.max(12, Number(process.env.BCRYPT_SALT_ROUNDS ?? 12))
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? '*'
  }
};
