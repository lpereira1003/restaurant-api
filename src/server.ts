import { app } from './app.js';
import { checkDatabaseConnection } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await checkDatabaseConnection();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`Swagger docs on http://localhost:${env.port}/api-docs`);
  });
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});
