export type Role = 'cliente' | 'admin';

export interface JwtPayload {
  id_usuario: number;
  correo: string;
  rol: Role;
}

export interface RegisterDto {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol?: Role;
}

export interface LoginDto {
  correo: string;
  password: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  password_hash: string;
  rol: Role;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface UsuarioPublico {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: Role;
  activo: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
