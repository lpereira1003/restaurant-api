-- Schema de referencia para la base restaurant_reservations_db.
-- La API usa estas tablas y columnas reales en el schema public.

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'cliente')),
  activo BOOLEAN NOT NULL DEFAULT true,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mesas (
  id_mesa SERIAL PRIMARY KEY,
  numero_mesa INTEGER NOT NULL UNIQUE,
  capacidad INTEGER NOT NULL CHECK (capacidad > 0),
  ubicacion VARCHAR(100),
  descripcion TEXT,
  activa BOOLEAN NOT NULL DEFAULT true,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservaciones (
  id_reservacion SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL CONSTRAINT fk_reservaciones_usuarios REFERENCES usuarios(id_usuario),
  id_mesa INTEGER NOT NULL CONSTRAINT fk_reservaciones_mesas REFERENCES mesas(id_mesa),
  fecha_reservacion DATE NOT NULL,
  hora_reservacion TIME NOT NULL,
  cantidad_personas INTEGER NOT NULL CHECK (cantidad_personas > 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada', 'rechazada')),
  observaciones TEXT,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_mesa_fecha_hora UNIQUE (id_mesa, fecha_reservacion, hora_reservacion)
);
