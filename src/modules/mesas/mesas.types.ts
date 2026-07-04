export interface Mesa {
  id_mesa: number;
  numero_mesa: number;
  capacidad: number;
  ubicacion?: string;
  descripcion?: string;
  activa: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateMesaDto {
  numero_mesa: number;
  capacidad: number;
  ubicacion?: string;
  descripcion?: string;
}

export interface UpdateMesaDto {
  numero_mesa?: number;
  capacidad?: number;
  ubicacion?: string;
  descripcion?: string;
  activa?: boolean;
}
