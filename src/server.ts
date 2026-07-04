import { app } from './app.js';
import { checkDatabaseConnection } from './config/db.js';

const PORT = Number(process.env.PORT || 3000);

const startServer = async () => {
  await checkDatabaseConnection();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en http://0.0.0.0:${PORT}`);
    console.log(`Swagger disponible en /api-docs`);
  });
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
