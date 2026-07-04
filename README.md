# API REST de Reservaciones de Restaurante

API REST en Node.js, TypeScript y Express para autenticacion, mesas y reservaciones de restaurante. Usa PostgreSQL con Prisma Client, JWT y bcrypt.

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL con Prisma Client
- JWT
- bcrypt
- Zod
- Swagger UI
- dotenv, cors, helmet, morgan
- pnpm
- ESLint y Prettier

## Instalacion

Requisitos:

- Node.js compatible con el proyecto.
- pnpm.
- PostgreSQL en ejecucion.
- Base de datos `restaurant_reservations_db` creada.

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

El archivo `.env.example` contiene las variables necesarias para ejecutar el proyecto. Copialo a `.env` y ajusta los valores segun tu entorno local o de produccion.

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://usuario:password@localhost:5432/restaurant_reservations_db?schema=public"

JWT_SECRET="cambiar_por_una_clave_segura"
JWT_EXPIRES_IN="1d"
BCRYPT_SALT_ROUNDS=12
CORS_ORIGIN=*
```

Variables principales:

- `DATABASE_URL`: cadena de conexion PostgreSQL usada por Prisma.
- `JWT_SECRET`: secreto para firmar y verificar JWT. En produccion debe cambiarse.
- `JWT_EXPIRES_IN`: tiempo de expiracion del token.
- `BCRYPT_SALT_ROUNDS`: factor de costo bcrypt. El proyecto fuerza minimo `12`.
- `CORS_ORIGIN`: origen permitido para CORS. Usa `*` en desarrollo o una lista separada por comas.

Para produccion, usar `.env.production.example` como referencia y configurar los valores en el panel del proveedor. La guia paso a paso esta en [docs/deployment.md](docs/deployment.md). Para publicar el repositorio, ver [docs/github-publication.md](docs/github-publication.md).

## Credenciales de prueba

Administrador

Correo:
`admin.123@email.com`

Contrasena:
`admin123*`

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

Validacion:

```bash
pnpm prisma generate
pnpm prisma validate
pnpm typecheck
pnpm build
```

Archivos excluidos por `.gitignore`:

- `.env`
- `.idea`
- `node_modules`
- `dist`
- `server.log`
- logs y archivos generados por npm

## Endpoints principales

Health check:

```text
GET /api/health
```

Swagger:

```text
GET /api-docs
```

Autorizacion en Swagger UI:

- En el boton `Authorize`, pegar solo el JWT, sin escribir `Bearer`.
- Swagger concatena automaticamente el prefijo `Bearer`.
- Si escribes `Bearer` manualmente en Swagger, el header puede quedar duplicado: `Authorization: Bearer Bearer ey...`.
- En Postman o clientes HTTP manuales si debes enviar el header completo: `Authorization: Bearer <token>`.

Coleccion Postman:

```text
docs/postman/restaurant-reservations.postman_collection.json
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

## Roadmap

- Verificado en Postman y Swagger: `GET /api/reservaciones` como `admin` con `Authorization: Bearer <token_admin>` y `Content-Type: application/json`.
- Verificado en Postman y Swagger: `POST /api/auth/register` registra usuarios `cliente` correctamente.
- Verificado en Postman y Swagger: `POST /api/auth/login` obtiene JWT para usuarios `cliente` correctamente.
- Desplegar API en produccion con base de datos remota, variables de entorno configuradas, `/api-docs` accesible publicamente y endpoints verificados en la URL de produccion.
- Publicar el repositorio en GitHub como repositorio publico.
- Completar historial de commits progresivo hasta al menos 8 commits significativos.

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
