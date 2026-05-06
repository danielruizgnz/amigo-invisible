export interface Usuario {
  id: string;
  nombre: string;
  telefono: string;
  creado_en: string;
}

export interface Grupo {
  id: string;
  nombre: string;
  organizador_id: string;
  fecha_evento: string | null;
  presupuesto: number | null;
  estado: "pendiente" | "sorteado";
  creado_en: string;
  organizador?: Usuario;
}

export interface Participante {
  id: string;
  grupo_id: string;
  usuario_id: string;
  asignado_a_id: string | null;
  token_secreto: string;
  creado_en: string;
  usuario?: Usuario;
  asignado_a?: Usuario;
}

export interface Exclusion {
  id: string;
  grupo_id: string;
  de_usuario_id: string;
  a_usuario_id: string;
}

export interface ItemDeseos {
  id: string;
  usuario_id: string;
  grupo_id: string;
  titulo: string;
  url: string | null;
  notas: string | null;
  creado_en: string;
}

export interface SesionUsuario {
  id: string;
  nombre: string;
  telefono: string;
}
