export const TIPO_DOCUMENTO_ENUM = [
  "CC",
  "TI",
  "CE",
  "PASAPORTE",
  "PEP",
  "NIT",
  "RUT",
];

export const TIPO_DOCUMENTO_OPTIONS = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "PEP", label: "Permiso Especial de Permanencia" },
  { value: "NIT", label: "NIT" },
  { value: "RUT", label: "RUT" },
];

export const GENERO_ENUM = ["MASCULINO", "FEMENINO", "OTRO", "PREFIERE_NO_DECIR"];
export const GENERO_OPTIONS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
  { value: "OTRO", label: "Otro" },
  { value: "PREFIERE_NO_DECIR", label: "Prefiere no decir" },
];

export const NATIONALITY_OPTIONS = [
  { value: "Colombia", label: "Colombia" },
  { value: "Estados Unidos", label: "Estados Unidos" },
  { value: "México", label: "México" },
  { value: "Argentina", label: "Argentina" },
  { value: "Brasil", label: "Brasil" },
  { value: "Chile", label: "Chile" },
  { value: "España", label: "España" },
  { value: "Italia", label: "Italia" },
  { value: "Alemania", label: "Alemania" },
  { value: "Reino Unido", label: "Reino Unido" },
  { value: "Canadá", label: "Canadá" },
  { value: "Francia", label: "Francia" },
];

export const NIVEL_IDIOMA_ENUM = ["NATIVO", "AVANZADO", "INTERMEDIO", "BASICO"];
export const NIVEL_IDIOMA_OPTIONS = [
  { value: "NATIVO", label: "Nativo" },
  { value: "AVANZADO", label: "Avanzado" },
  { value: "INTERMEDIO", label: "Intermedio" },
  { value: "BASICO", label: "Básico" },
];

export const ESTADO_USUARIO_ENUM = ["ACTIVO", "INACTIVO", "BLOQUEADO"];
export const ESTADO_USUARIO_OPTIONS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
  { value: "BLOQUEADO", label: "Bloqueado" },
];

export const ESTADO_TOUR_ENUM = ["BORRADOR", "ACTIVO", "INACTIVO"];
export const ESTADO_TOUR_OPTIONS = [
  { value: "BORRADOR", label: "Borrador" },
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
];

export const ESTADO_SALIDA_ENUM = [
  "PROGRAMADA",
  "DISPONIBLE",
  "COMPLETA",
  "CANCELADA",
  "FINALIZADA",
];
export const ESTADO_SALIDA_OPTIONS = [
  { value: "PROGRAMADA", label: "Programada" },
  { value: "DISPONIBLE", label: "Disponible" },
  { value: "COMPLETA", label: "Completa" },
  { value: "CANCELADA", label: "Cancelada" },
  { value: "FINALIZADA", label: "Finalizada" },
];

export const ESTADO_RESERVA_ENUM = [
  "PENDIENTE",
  "CONFIRMADA",
  "CANCELADA",
  "COMPLETADA",
];
export const ESTADO_RESERVA_OPTIONS = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "CONFIRMADA", label: "Confirmada" },
  { value: "CANCELADA", label: "Cancelada" },
  { value: "COMPLETADA", label: "Completada" },
];

export const ESTADO_GRUPO_ENUM = ["ACTIVO", "FINALIZADO", "CANCELADO"];
export const ESTADO_GRUPO_OPTIONS = [
  { value: "ACTIVO", label: "Activo" },
  { value: "FINALIZADO", label: "Finalizado" },
  { value: "CANCELADO", label: "Cancelado" },
];

export const ESTADO_VENTA_ENUM = ["PENDIENTE", "PARCIAL", "PAGADA", "CANCELADA"];
export const ESTADO_VENTA_OPTIONS = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "PARCIAL", label: "Parcial" },
  { value: "PAGADA", label: "Pagada" },
  { value: "CANCELADA", label: "Cancelada" },
];

export const DIFICULTAD_OPTIONS = [
  { value: "FÁCIL", label: "Fácil" },
  { value: "MEDIO", label: "Medio" },
  { value: "DIFÍCIL", label: "Difícil" },
];

export const METODO_PAGO_ENUM = [
  "EFECTIVO",
  "TARJETA_CREDITO",
  "TARJETA_DEBITO",
  "TRANSFERENCIA",
  "PSE",
];
export const METODO_PAGO_OPTIONS = [
  { value: 1, label: "Efectivo", code: "EFECTIVO" },
  { value: 2, label: "Tarjeta de Crédito", code: "TARJETA_CREDITO" },
  { value: 3, label: "Tarjeta de Débito", code: "TARJETA_DEBITO" },
  { value: 4, label: "Transferencia Bancaria", code: "TRANSFERENCIA" },
  { value: 5, label: "PSE", code: "PSE" },
];
