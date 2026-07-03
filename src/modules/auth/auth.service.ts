import { AppError } from '../../middlewares/error.middleware.js';
import { prisma } from '../../config/db.js';
import { comparePassword, hashPassword } from '../../utils/bcrypt.js';
import { signToken } from '../../utils/jwt.js';
import { JwtPayload, LoginDto, RegisterDto, Usuario, UsuarioPublico } from './auth.types.js';

const toPublicUser = (usuario: Usuario): UsuarioPublico => ({
  id_usuario: usuario.id_usuario,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  correo: usuario.correo,
  rol: usuario.rol,
  activo: usuario.activo,
  fecha_creacion: usuario.fecha_creacion,
  fecha_actualizacion: usuario.fecha_actualizacion
});

/**
 * Registra un usuario cliente desde el endpoint publico.
 * El rol admin se bloquea aqui para evitar elevacion de privilegios desde registro abierto.
 */
export const register = async (payload: RegisterDto) => {
  if (payload.rol && payload.rol !== 'cliente') {
    throw new AppError(403, 'No puedes registrar usuarios admin desde este endpoint');
  }

  const rol = 'cliente';

  const passwordHash = await hashPassword(payload.password);

  try {
    const usuarioRecord = await prisma.usuario.create({
      data: {
        nombre: payload.nombre,
        apellido: payload.apellido,
        correo: payload.correo,
        password_hash: passwordHash,
        rol
      }
    });

    const usuario = toPublicUser(usuarioRecord as Usuario);
    const token = signToken({
      id_usuario: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol
    });

    return { usuario, token };
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') {
      throw new AppError(409, 'El correo ya esta registrado');
    }

    throw error;
  }
};

/**
 * Autentica por correo y contrasena, valida el hash bcrypt almacenado y emite JWT.
 */
export const login = async (payload: LoginDto) => {
  const usuarioRecord = await prisma.usuario.findUnique({
    where: {
      correo: payload.correo
    }
  });

  if (!usuarioRecord || !usuarioRecord.activo) {
    throw new AppError(401, 'Credenciales invalidas');
  }

  const passwordValido = await comparePassword(payload.password, usuarioRecord.password_hash);

  if (!passwordValido) {
    throw new AppError(401, 'Credenciales invalidas');
  }

  const usuario = toPublicUser(usuarioRecord as Usuario);
  const token = signToken({
    id_usuario: usuario.id_usuario,
    correo: usuario.correo,
    rol: usuario.rol
  });

  return { usuario, token };
};

/**
 * Devuelve el perfil publico del usuario autenticado sin exponer password_hash.
 */
export const getProfile = async (jwtPayload: JwtPayload) => {
  const usuario = await prisma.usuario.findFirst({
    where: {
      id_usuario: jwtPayload.id_usuario,
      activo: true
    },
    select: {
      id_usuario: true,
      nombre: true,
      apellido: true,
      correo: true,
      rol: true,
      activo: true,
      fecha_creacion: true,
      fecha_actualizacion: true
    }
  });

  if (!usuario) {
    throw new AppError(404, 'Usuario no encontrado');
  }

  return usuario;
};
