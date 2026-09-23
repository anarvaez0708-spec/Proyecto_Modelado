export type Role = 'ADMINISTRADOR' | 'GUIA' | 'TURISTA';
export type User = { id_usuario: number; nombre: string; apellido: string; correo: string; telefono?: string | null; estado: string; roles?: Role[] };
export type Tour = Record<string, unknown> & { id_tour: number; id_categoria: number; nombre: string; precio_base: number; estado: string };
export type Client = Record<string, unknown> & { id_turista: number; correo?: string; nombre?: string; apellido?: string };
export type Booking = Record<string, unknown> & { id_reserva: number; id_turista: number; id_salida: number; estado: string; total: number };