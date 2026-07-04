# Despliegue en produccion

Guia operativa para publicar la API REST de reservaciones en un proveedor Node.js con PostgreSQL administrado.

## Requisitos

- Repositorio Git publicado.
- Base de datos PostgreSQL remota creada.
- Variables de entorno configuradas desde `.env.production.example`.
- Comando de build: `pnpm build`.
- Comando de inicio: `pnpm start`.

## Variables

Configurar estas variables en el panel del proveedor:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/restaurant_reservations_db?schema=public&sslmode=require"
JWT_SECRET=generar-un-secreto-largo-y-unico
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=https://tu-dominio.com
```

Notas:

- `JWT_SECRET` debe ser distinto al valor local y no debe subirse al repositorio.
- `CORS_ORIGIN` puede ser una lista separada por comas si hay mas de un frontend.
- Si el proveedor ya inyecta `PORT`, usar la variable que entrega el entorno.

## Base de datos

1. Crear la base `restaurant_reservations_db`.
2. Ejecutar el SQL de [database/schema.sql](../database/schema.sql).
3. Crear el usuario administrador con el script de seed o por SQL controlado.
4. Verificar que las tablas existan: `usuarios`, `mesas`, `reservaciones`.

## Verificacion

Despues del despliegue, validar:

```text
GET /api/health
GET /api-docs
POST /api/auth/login
GET /api/reservaciones
```

Para endpoints protegidos:

- En Swagger, pegar solo el JWT en `Authorize`.
- En Postman, enviar `Authorization: Bearer <token>`.

## Comandos locales previos

Ejecutar antes de publicar cambios:

```bash
pnpm prisma validate
pnpm typecheck
pnpm lint
pnpm build
```
