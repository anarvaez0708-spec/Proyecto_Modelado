import { supabase, isSupabaseConfigured, withMockDelay } from "@/shared/lib/supabase";
import { api, isApiConfigured } from "@/shared/lib/api";
import { ESTADO_USUARIO_OPTIONS } from "@/shared/constants/dbEnums";

export const mockClientes = [
  {
    id_turista: 1,
    id_usuario: 101,
    nombre: "Juan",
    apellido: "Pérez",
    nombre_completo: "Juan Pérez",
    correo: "juan@email.com",
    telefono: "+57 300 1234567",
    estado: "ACTIVO",
    tipo_documento: "CC",
    numero_documento: "1020304050",
    fecha_nacimiento: "1990-05-15",
    genero: "MASCULINO",
    nacionalidad: "Colombia",
    pais_residencia: "Colombia",
    ciudad_residencia: "Medellín",
    direccion: "Calle 10 # 20-30, El Poblado",
    contacto_emergencia_nombre: "María Pérez",
    contacto_emergencia_telefono: "+57 300 9876543",
    contacto_emergencia_parentesco: "Hermana",
    preferencias: "Prefiere horarios matutinos. Alergia a mariscos.",
    observaciones: "Cliente frecuente, solicita siempre guía bilingüe.",
    vip: true,
    cantidad_reservas: 12,
    gasto_total: 5400000,
    fecha_registro: "2024-01-15",
    ultima_reserva: "2026-06-05",
  },
  {
    id_turista: 2,
    id_usuario: 102,
    nombre: "María",
    apellido: "Smith",
    nombre_completo: "María Smith",
    correo: "maria@email.com",
    telefono: "+57 300 1234568",
    estado: "ACTIVO",
    tipo_documento: "PASAPORTE",
    numero_documento: "US123456789",
    fecha_nacimiento: "1995-08-22",
    genero: "FEMENINO",
    nacionalidad: "Estados Unidos",
    pais_residencia: "Estados Unidos",
    ciudad_residencia: "Miami",
    direccion: "",
    contacto_emergencia_nombre: "John Smith",
    contacto_emergencia_telefono: "+1 305 555 0101",
    contacto_emergencia_parentesco: "Esposo",
    preferencias: "Vegetariana. Necesita factura en USD.",
    observaciones: "",
    vip: false,
    cantidad_reservas: 4,
    gasto_total: 720000,
    fecha_registro: "2025-08-20",
    ultima_reserva: "2026-06-05",
  },
  {
    id_turista: 3,
    id_usuario: 103,
    nombre: "Luca",
    apellido: "Rossi",
    nombre_completo: "Luca Rossi",
    correo: "luca@email.com",
    telefono: "+57 300 1234569",
    estado: "ACTIVO",
    tipo_documento: "PASAPORTE",
    numero_documento: "IT987654321",
    fecha_nacimiento: "1988-11-10",
    genero: "MASCULINO",
    nacionalidad: "Italia",
    pais_residencia: "Italia",
    ciudad_residencia: "Roma",
    direccion: "",
    contacto_emergencia_nombre: "Sofia Rossi",
    contacto_emergencia_telefono: "+39 06 1234 5678",
    contacto_emergencia_parentesco: "Madre",
    preferencias: "",
    observaciones: "Solo habla italiano y algo de inglés.",
    vip: false,
    cantidad_reservas: 3,
    gasto_total: 540000,
    fecha_registro: "2025-11-10",
    ultima_reserva: "2026-06-04",
  },
  {
    id_turista: 4,
    id_usuario: 104,
    nombre: "Sofía",
    apellido: "López",
    nombre_completo: "Sofía López",
    correo: "sofia@email.com",
    telefono: "+57 300 1234570",
    estado: "ACTIVO",
    tipo_documento: "CC",
    numero_documento: "43526178",
    fecha_nacimiento: "1992-03-28",
    genero: "FEMENINO",
    nacionalidad: "Argentina",
    pais_residencia: "Colombia",
    ciudad_residencia: "Bogotá",
    direccion: "Carrera 7 # 72-02",
    contacto_emergencia_nombre: "Pedro López",
    contacto_emergencia_telefono: "+57 310 2223344",
    contacto_emergencia_parentesco: "Padre",
    preferencias: "Silla de ruedas: requiere accesibilidad.",
    observaciones: "Cliente VIP corporativo (empresa asociada).",
    vip: true,
    cantidad_reservas: 8,
    gasto_total: 3200000,
    fecha_registro: "2024-05-12",
    ultima_reserva: "2026-06-03",
  },
  {
    id_turista: 5,
    id_usuario: 105,
    nombre: "Carlos",
    apellido: "Gómez",
    nombre_completo: "Carlos Gómez",
    correo: "carlos@email.com",
    telefono: "+57 300 1234571",
    estado: "INACTIVO",
    tipo_documento: "CC",
    numero_documento: "77889900",
    fecha_nacimiento: "1985-12-05",
    genero: "MASCULINO",
    nacionalidad: "Colombia",
    pais_residencia: "Colombia",
    ciudad_residencia: "Medellín",
    direccion: "Barrio Laureles, Calle 70 # 45-12",
    contacto_emergencia_nombre: "",
    contacto_emergencia_telefono: "",
    contacto_emergencia_parentesco: "",
    preferencias: "",
    observaciones: "No ha vuelto a reservar desde diciembre 2025.",
    vip: false,
    cantidad_reservas: 1,
    gasto_total: 160000,
    fecha_registro: "2025-10-01",
    ultima_reserva: "2025-12-20",
  },
  {
    id_turista: 6,
    id_usuario: 106,
    nombre: "Emma",
    apellido: "Wilson",
    nombre_completo: "Emma Wilson",
    correo: "emma@email.com",
    telefono: "+57 300 1234572",
    estado: "ACTIVO",
    tipo_documento: "PASAPORTE",
    numero_documento: "GB556677889",
    fecha_nacimiento: "1998-09-14",
    genero: "FEMENINO",
    nacionalidad: "Reino Unido",
    pais_residencia: "Reino Unido",
    ciudad_residencia: "Londres",
    direccion: "",
    contacto_emergencia_nombre: "James Wilson",
    contacto_emergencia_telefono: "+44 20 7946 0958",
    contacto_emergencia_parentesco: "Hermano",
    preferencias: "Alergia a frutos secos.",
    observaciones: "",
    vip: false,
    cantidad_reservas: 5,
    gasto_total: 1230000,
    fecha_registro: "2025-09-15",
    ultima_reserva: "2026-06-02",
  },
];

export const emptyClientForm = {
  firstName: "",
  lastName: "",
  correo: "",
  telefono: "",
  estado: "ACTIVO",

  tipo_documento: "",
  numero_documento: "",
  fecha_nacimiento: "",
  genero: "",
  nacionalidad: "",
  pais_residencia: "",
  ciudad_residencia: "",
  direccion: "",
  contacto_emergencia_nombre: "",
  contacto_emergencia_telefono: "",
  contacto_emergencia_parentesco: "",
  preferencias: "",
  observaciones: "",
  vip: false,

  cantidad_reservas: 0,
  gasto_total: 0,
  fecha_registro: new Date().toISOString().split("T")[0],
  ultima_reserva: "",
};

export const CLIENT_STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  ...ESTADO_USUARIO_OPTIONS,
];

export const CLIENT_VIP_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "yes", label: "Solo VIP" },
  { value: "no", label: "No VIP" },
];

export const clientServices = {
  async fetchClientes() {
    if (isApiConfigured) {
      const data = await api.get("/clients");
      return data.map((client) => ({
        ...client,
        ...(client.usuarios || {}),
        nombre_completo: [client.usuarios?.nombre, client.usuarios?.apellido].filter(Boolean).join(" "),
        nombre: client.usuarios?.nombre ?? "",
        apellido: client.usuarios?.apellido ?? "",
        correo: client.usuarios?.correo ?? "",
        telefono: client.usuarios?.telefono ?? "",
        estado: client.usuarios?.estado ?? "ACTIVO",
      }));
    }
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("turistas")
          .select(
            `
            id_turista,
            id_usuario,
            tipo_documento,
            numero_documento,
            fecha_nacimiento,
            genero,
            nacionalidad,
            pais_residencia,
            ciudad_residencia,
            direccion,
            contacto_emergencia_nombre,
            contacto_emergencia_telefono,
            contacto_emergencia_parentesco,
            preferencias,
            observaciones,
            vip,
            fecha_registro,
            usuarios:usuarios!turistas_id_usuario_fkey (
              nombre,
              apellido,
              correo,
              telefono,
              estado
            )
          `
          )
          .order("fecha_registro", { ascending: false });
        if (error) throw error;
        return (data ?? []).map((t) => ({
          ...t,
          nombre: t.usuarios?.nombre ?? "",
          apellido: t.usuarios?.apellido ?? "",
          nombre_completo: [t.usuarios?.nombre ?? "", t.usuarios?.apellido ?? ""].filter(Boolean).join(" "),
          correo: t.usuarios?.correo ?? "",
          telefono: t.usuarios?.telefono ?? "",
          estado: t.usuarios?.estado ?? "ACTIVO",
        }));
      } catch (err) {
        console.error("Error fetching clientes:", err);
      }
    }
    return withMockDelay([...mockClientes], 400);
  },

  async createCliente({ usuario, turista }) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: userData, error: userError } = await supabase
          .from("usuarios")
          .insert([usuario])
          .select()
          .single();
        if (userError) throw userError;
        const { data: turistaData, error: tError } = await supabase
          .from("turistas")
          .insert([{ ...turista, id_usuario: userData.id_usuario }])
          .select()
          .single();
        if (tError) throw tError;
        return {
          ...turistaData,
          nombre: userData.nombre,
          apellido: userData.apellido,
          nombre_completo: [userData.nombre, userData.apellido].filter(Boolean).join(" "),
          correo: userData.correo,
          telefono: userData.telefono,
          estado: userData.estado,
        };
      } catch (err) {
        console.error("Error creating cliente:", err);
      }
    }
    const nextUsuarioId = mockClientes.length > 0 ? Math.max(...mockClientes.map((c) => c.id_usuario)) + 1 : 101;
    const nextTuristaId = mockClientes.length > 0 ? Math.max(...mockClientes.map((c) => c.id_turista)) + 1 : 1;
    const nombreCompleto = [usuario?.nombre ?? "", usuario?.apellido ?? ""].filter(Boolean).join(" ");
    const nuevo = {
      id_turista: nextTuristaId,
      id_usuario: nextUsuarioId,
      nombre: usuario?.nombre ?? "",
      apellido: usuario?.apellido ?? "",
      nombre_completo: nombreCompleto,
      correo: usuario?.correo ?? "",
      telefono: usuario?.telefono ?? "",
      estado: usuario?.estado ?? "ACTIVO",
      tipo_documento: turista?.tipo_documento ?? "",
      numero_documento: turista?.numero_documento ?? "",
      fecha_nacimiento: turista?.fecha_nacimiento ?? "",
      genero: turista?.genero ?? "",
      nacionalidad: turista?.nacionalidad ?? "",
      pais_residencia: turista?.pais_residencia ?? "",
      ciudad_residencia: turista?.ciudad_residencia ?? "",
      direccion: turista?.direccion ?? "",
      contacto_emergencia_nombre: turista?.contacto_emergencia_nombre ?? "",
      contacto_emergencia_telefono: turista?.contacto_emergencia_telefono ?? "",
      contacto_emergencia_parentesco: turista?.contacto_emergencia_parentesco ?? "",
      preferencias: turista?.preferencias ?? "",
      observaciones: turista?.observaciones ?? "",
      vip: Boolean(turista?.vip),
      cantidad_reservas: 0,
      gasto_total: 0,
      fecha_registro: new Date().toISOString().split("T")[0],
      ultima_reserva: "",
    };
    mockClientes.push(nuevo);
    return withMockDelay(nuevo, 300);
  },

  async updateCliente(id_turista, { usuario, turista }) {
    if (isSupabaseConfigured && supabase) {
      try {
        const existing = await supabase
          .from("turistas")
          .select("id_usuario")
          .eq("id_turista", id_turista)
          .single();
        if (existing.error) throw existing.error;
        const id_usuario = existing.data.id_usuario;
        if (usuario) {
          const { error: ue } = await supabase.from("usuarios").update(usuario).eq("id_usuario", id_usuario);
          if (ue) throw ue;
        }
        if (turista) {
          const { error: te } = await supabase.from("turistas").update(turista).eq("id_turista", id_turista);
          if (te) throw te;
        }
        return true;
      } catch (err) {
        console.error("Error updating cliente:", err);
      }
    }
    const idx = mockClientes.findIndex((c) => c.id_turista === Number(id_turista));
    if (idx >= 0) {
      const current = mockClientes[idx];
      const merged = {
        ...current,
        nombre: usuario?.nombre ?? current.nombre,
        apellido: usuario?.apellido ?? current.apellido,
        nombre_completo: [usuario?.nombre ?? current.nombre, usuario?.apellido ?? current.apellido].filter(Boolean).join(" "),
        correo: usuario?.correo ?? current.correo,
        telefono: usuario?.telefono ?? current.telefono,
        estado: usuario?.estado ?? current.estado,
        tipo_documento: turista?.tipo_documento ?? current.tipo_documento,
        numero_documento: turista?.numero_documento ?? current.numero_documento,
        fecha_nacimiento: turista?.fecha_nacimiento ?? current.fecha_nacimiento,
        genero: turista?.genero ?? current.genero,
        nacionalidad: turista?.nacionalidad ?? current.nacionalidad,
        pais_residencia: turista?.pais_residencia ?? current.pais_residencia,
        ciudad_residencia: turista?.ciudad_residencia ?? current.ciudad_residencia,
        direccion: turista?.direccion ?? current.direccion,
        contacto_emergencia_nombre: turista?.contacto_emergencia_nombre ?? current.contacto_emergencia_nombre,
        contacto_emergencia_telefono: turista?.contacto_emergencia_telefono ?? current.contacto_emergencia_telefono,
        contacto_emergencia_parentesco: turista?.contacto_emergencia_parentesco ?? current.contacto_emergencia_parentesco,
        preferencias: turista?.preferencias ?? current.preferencias,
        observaciones: turista?.observaciones ?? current.observaciones,
        vip: turista?.vip != null ? Boolean(turista.vip) : current.vip,
      };
      mockClientes[idx] = merged;
      return withMockDelay(merged, 300);
    }
    return null;
  },

  async deleteCliente(id_turista) {
    if (isSupabaseConfigured && supabase) {
      try {
        const existing = await supabase
          .from("turistas")
          .select("id_usuario")
          .eq("id_turista", id_turista)
          .single();
        if (!existing.error && existing.data?.id_usuario) {
          const id_usuario = existing.data.id_usuario;
          await supabase.from("turistas").delete().eq("id_turista", id_turista);
          await supabase.from("usuarios").delete().eq("id_usuario", id_usuario);
        }
        return true;
      } catch (err) {
        console.error("Error deleting cliente:", err);
        return false;
      }
    }
    const idx = mockClientes.findIndex((c) => c.id_turista === Number(id_turista));
    if (idx >= 0) mockClientes.splice(idx, 1);
    return withMockDelay(true, 250);
  },

  computeStats(clientes, filteredCount) {
    const total = clientes.length;
    const vip = clientes.filter((c) => c.vip).length;
    const activos = clientes.filter((c) => c.estado === "ACTIVO").length;
    const inactivos = clientes.filter((c) => c.estado === "INACTIVO" || c.estado === "BLOQUEADO").length;
    const totalRevenueNum = clientes.reduce((s, c) => s + (c.gasto_total ?? 0), 0);
    return {
      total,
      vip,
      activos,
      inactivos,
      totalRevenue: `$${totalRevenueNum.toLocaleString()}`,
      filtered: filteredCount,
    };
  },

  initials(nombreCompleto = "") {
    return String(nombreCompleto)
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },

  exportCSV(clientes) {
    const headers = [
      "ID Turista",
      "Nombre",
      "Apellido",
      "Correo",
      "Teléfono",
      "Estado Usuario",
      "VIP",
      "Tipo Doc",
      "Número Doc",
      "Fecha Nacimiento",
      "Género",
      "Nacionalidad",
      "País Residencia",
      "Ciudad Residencia",
      "Dirección",
      "Contacto Emergencia",
      "Teléfono Emergencia",
      "Parentesco",
      "Reservas",
      "Gasto Total",
      "Fecha Registro",
      "Última Reserva",
    ];
    const csv = [
      headers.join(","),
      ...clientes.map((c) =>
        [
          c.id_turista ?? c.id ?? "",
          `"${c.nombre ?? ""}"`,
          `"${c.apellido ?? ""}"`,
          `"${c.correo ?? ""}"`,
          `"${c.telefono ?? ""}"`,
          c.estado ?? "",
          c.vip ? "Sí" : "No",
          c.tipo_documento ?? "",
          `"${c.numero_documento ?? ""}"`,
          c.fecha_nacimiento ?? "",
          c.genero ?? "",
          `"${c.nacionalidad ?? ""}"`,
          `"${c.pais_residencia ?? ""}"`,
          `"${c.ciudad_residencia ?? ""}"`,
          `"${(c.direccion ?? "").replace(/"/g, '""')}"`,
          `"${c.contacto_emergencia_nombre ?? ""}"`,
          `"${c.contacto_emergencia_telefono ?? ""}"`,
          `"${c.contacto_emergencia_parentesco ?? ""}"`,
          c.cantidad_reservas ?? 0,
          c.gasto_total ?? 0,
          c.fecha_registro ?? "",
          c.ultima_reserva ?? "",
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clientes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

export default clientServices;
