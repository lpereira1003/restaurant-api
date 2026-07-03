# API REST de Reservaciones de Restaurante

API REST en Node.js, TypeScript y Express para autenticacion, mesas y reservaciones de restaurante. Usa PostgreSQL con `pg`, JWT y bcrypt. No usa ORM.

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL con `pg`
- JWT
- bcrypt
- Swagger UI
- dotenv, cors, helmet, morgan
- pnpm
- ESLint y Prettier

## Instalacion

```bash
pnpm install
```

Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Variables de entorno

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://postgres:root@localhost:5432/restaurant_reservations_db?schema=public"

JWT_SECRET=cambia-este-secreto-en-produccion
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=*
```

## Base de datos real

Base de datos: `restaurant_reservations_db`

Schema: `public`

Tabla `usuarios`:

- `id_usuario`
- `nombre`
- `apellido`
- `correo`
- `password_hash`
- `rol`
- `activo`
- `fecha_creacion`
- `fecha_actualizacion`

Tabla `mesas`:

- `id_mesa`
- `numero_mesa`
- `capacidad`
- `ubicacion`
- `descripcion`
- `activa`
- `fecha_creacion`
- `fecha_actualizacion`

Tabla `reservaciones`:

- `id_reservacion`
- `id_usuario`
- `id_mesa`
- `fecha_reservacion`
- `hora_reservacion`
- `cantidad_personas`
- `estado`
- `observaciones`
- `fecha_creacion`
- `fecha_actualizacion`

Roles validos:

- `admin`
- `cliente`

Estados validos de reservacion:

- `pendiente`
- `confirmada`
- `cancelada`
- `completada`
- `rechazada`

## Ejecucion

Desarrollo:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Produccion:

```bash
pnpm start
```

Calidad:

```bash
pnpm lint
pnpm format
```

## Endpoints principales

Health check:

```text
GET /api/health
```

Swagger:

```text
GET /api-docs
```

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/perfil`

Mesas:

- `GET /api/mesas`
- `GET /api/mesas/:id`
- `POST /api/mesas` solo `admin`
- `PUT /api/mesas/:id` solo `admin`
- `DELETE /api/mesas/:id` solo `admin`, hace soft delete con `activa = false`

Reservaciones:

- `POST /api/reservaciones` solo `cliente`
- `GET /api/reservaciones/mis` solo `cliente`
- `GET /api/reservaciones` solo `admin`
- `PUT /api/reservaciones/:id/estado` solo `admin`
- `DELETE /api/reservaciones/:id` solo `cliente`, cancela solo reservaciones propias

## Reglas de negocio implementadas

- No se reservan mesas inactivas.
- No se permite doble reserva para la misma mesa en la misma fecha y hora cuando esta `pendiente` o `confirmada`.
- No se permite reservar si `cantidad_personas` supera la `capacidad` de la mesa.
- Nunca se devuelve `password_hash`.
- El token JWT incluye `id_usuario`, `correo` y `rol`.
- El cliente solo consulta sus propias reservaciones.
- El cliente solo cancela sus propias reservaciones.

## Estructura del proyecto

```text
database/
  schema.sql
  seed.sql

src/
  config/
    env.ts
    db.ts
    swagger.ts
  middlewares/
    auth.middleware.ts
    role.middleware.ts
    error.middleware.ts
    validate.middleware.ts
  modules/
    auth/
      auth.routes.ts
      auth.controller.ts
      auth.service.ts
      auth.types.ts
    mesas/
      mesas.routes.ts
      mesas.controller.ts
      mesas.service.ts
      mesas.types.ts
    reservaciones/
      reservaciones.routes.ts
      reservaciones.controller.ts
      reservaciones.service.ts
      reservaciones.types.ts
  utils/
    jwt.ts
    bcrypt.ts
    responses.ts
  app.ts
  server.ts
```
