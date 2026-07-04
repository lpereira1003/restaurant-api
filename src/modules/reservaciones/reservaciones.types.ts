export type EstadoReservacion = 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'rechazada';

export interface Reservacion {
  id_reservacion: number;
  id_usuario: number;
  id_mesa: number;
  fecha_reservacion: string;
  hora_reservacion: string;
  cantidad_personas: number;
  estado: EstadoReservacion;
  observaciones?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateReservacionDto {
  id_mesa: number;
  fecha_reservacion: string;
  hora_reservacion: string;
  cantidad_personas: number;
  observaciones?: string;
}

export interface UpdateEstadoReservacionDto {
  estado: EstadoReservacion;
}
