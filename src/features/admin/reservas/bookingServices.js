import { supabase, isSupabaseConfigured, withMockDelay } from "@/shared/lib/supabase";
import { ESTADO_RESERVA_OPTIONS, ESTADO_USUARIO_OPTIONS, NATIONALITY_OPTIONS as SHARED_NATIONALITY_OPTIONS } from "@/shared/constants/dbEnums";
import { mockClientes } from "@/features/admin/clientes/clientServices";
import { mockSalidasTour, mockTours } from "@/features/admin/tours/tourServices";
import { mockGuides } from "@/features/admin/guias/guideServices";

const BOOKINGS_STORAGE_KEY = "artetours_mock_bookings";

export const BOOKING_STATUS_OPTIONS = [
  { value: "all", label: "Todos los estados" },
  ...ESTADO_RESERVA_OPTIONS,
];

export const CLIENT_STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  ...ESTADO_USUARIO_OPTIONS,
];

export const NATIONALITY_OPTIONS = SHARED_NATIONALITY_OPTIONS;

export const mockReservas = [
  {
    id_reserva: 1001,
    id_turista: 1,
    id_salida: 1,
    codigo_reserva: "RES-2026-0001",
    fecha_reserva: "2026-05-20",
    fecha_cancelacion: null,
    cantidad_adultos: 4,
    cantidad_ninos: 0,
    precio_unitario: 45000,
    descuento: 0,
    subtotal: 180000,
    total: 180000,
    estado: "CONFIRMADA",
    motivo_cancelacion: null,
    observaciones: "Preferencia por horario matutino. Guía bilingüe.",
    turista_nombre: "Juan Pérez",
    turista_correo: "juan@email.com",
    turista_telefono: "+57 300 1234567",
    salida_tour_nombre: "Comuna 13 Tour",
    salida_fecha: "2026-06-05",
    salida_hora: "09:00",
    salida_cupos_disponibles: 6,
    guia_nombre: "Carlos Muñoz",
  },
  {
    id_reserva: 1002,
    id_turista: 2,
    id_salida: 2,
    codigo_reserva: "RES-2026-0002",
    fecha_reserva: "2026-05-22",
    fecha_cancelacion: null,
    cantidad_adultos: 2,
    cantidad_ninos: 0,
    precio_unitario: 60000,
    descuento: 0,
    subtotal: 120000,
    total: 120000,
    estado: "PENDIENTE",
    motivo_cancelacion: null,
    observaciones: "Pago pendiente en hotel. Factura a nombre de Smith Corp.",
    turista_nombre: "María Smith",
    turista_correo: "maria@email.com",
    turista_telefono: "+57 300 1234568",
    salida_tour_nombre: "City Tour Clásico",
    salida_fecha: "2026-06-05",
    salida_hora: "14:00",
    salida_cupos_disponibles: 13,
    guia_nombre: "Andrés Patiño",
  },
  {
    id_reserva: 1003,
    id_turista: 3,
    id_salida: 3,
    codigo_reserva: "RES-2026-0003",
    fecha_reserva: "2026-05-18",
    fecha_cancelacion: null,
    cantidad_adultos: 4,
    cantidad_ninos: 2,
    precio_unitario: 55000,
    descuento: 10000,
    subtotal: 330000,
    total: 330000,
    estado: "CONFIRMADA",
    motivo_cancelacion: null,
    observaciones: "Solicitan menú infantil para los 2 niños.",
    turista_nombre: "Luca Rossi",
    turista_correo: "luca@email.com",
    turista_telefono: "+57 300 1234569",
    salida_tour_nombre: "Food Tour San Joaquín",
    salida_fecha: "2026-06-04",
    salida_hora: "18:00",
    salida_cupos_disponibles: 0,
    guia_nombre: "Luisa Zuluaga",
  },
  {
    id_reserva: 1004,
    id_turista: 5,
    id_salida: 5,
    codigo_reserva: "RES-2026-0004",
    fecha_reserva: "2025-12-01",
    fecha_cancelacion: "2025-12-10",
    cantidad_adultos: 2,
    cantidad_ninos: 0,
    precio_unitario: 80000,
    descuento: 0,
    subtotal: 160000,
    total: 160000,
    estado: "CANCELADA",
    motivo_cancelacion: "Clima adverso, lluvia fuerte pronosticada para el día del tour.",
    observaciones: "Reembolso procesado al 100%.",
    turista_nombre: "Carlos Gómez",
    turista_correo: "carlos@email.com",
    turista_telefono: "+57 300 1234571",
    salida_tour_nombre: "Pablo Escobar & Historia",
    salida_fecha: "2026-06-03",
    salida_hora: "08:30",
    salida_cupos_disponibles: 10,
    guia_nombre: "José Gutiérrez",
  },
  {
    id_reserva: 1005,
    id_turista: 6,
    id_salida: 1,
    codigo_reserva: "RES-2026-0005",
    fecha_reserva: "2026-05-25",
    fecha_cancelacion: null,
    cantidad_adultos: 3,
    cantidad_ninos: 0,
    precio_unitario: 45000,
    descuento: 0,
    subtotal: 135000,
    total: 135000,
    estado: "CONFIRMADA",
    motivo_cancelacion: null,
    observaciones: "Alergia a frutos secos. Confirmar refrigerio.",
    turista_nombre: "Emma Wilson",
    turista_correo: "emma@email.com",
    turista_telefono: "+57 300 1234572",
    salida_tour_nombre: "Comuna 13 Tour",
    salida_fecha: "2026-06-02",
    salida_hora: "15:00",
    salida_cupos_disponibles: 6,
    guia_nombre: "Carlos Muñoz",
  },
  {
    id_reserva: 1006,
    id_turista: 4,
    id_salida: 4,
    codigo_reserva: "RES-2026-0006",
    fecha_reserva: "2026-05-28",
    fecha_cancelacion: null,
    cantidad_adultos: 8,
    cantidad_ninos: 2,
    precio_unitario: 35000,
    descuento: 50000,
    subtotal: 350000,
    total: 350000,
    estado: "CONFIRMADA",
    motivo_cancelacion: null,
    observaciones: "Grupo corporativo VIP. Coordinar con punto de encuentro privado.",
    turista_nombre: "Sofía López",
    turista_correo: "sofia@email.com",
    turista_telefono: "+57 300 1234570",
    salida_tour_nombre: "Grafiti Tour Comuna 13",
    salida_fecha: "2026-06-01",
    salida_hora: "11:00",
    salida_cupos_disponibles: 10,
    guia_nombre: "Carlos Muñoz",
  },
];

function syncMockReservas(nextReservas) {
  mockReservas.splice(0, mockReservas.length, ...nextReservas);
}

export function getStoredReservas() {
  if (typeof window === "undefined" || isSupabaseConfigured) {
    return [...mockReservas];
  }
  try {
    const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      return [...mockReservas];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [...mockReservas];
    }
    syncMockReservas(parsed);
    return [...parsed];
  } catch {
    return [...mockReservas];
  }
}

export function persistStoredReservas(nextReservas) {
  syncMockReservas(nextReservas);
  if (typeof window === "undefined" || isSupabaseConfigured) {
    return;
  }
  window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(nextReservas));
}

export const mockReservaParticipantes = [
  {
    id_participante: 1,
    id_reserva: 1001,
    nombres: "Juan",
    apellidos: "Pérez",
    tipo_documento: "CC",
    numero_documento: "1020304050",
    fecha_nacimiento: "1990-05-15",
    nacionalidad: "Colombia",
    es_titular: true,
  },
  {
    id_participante: 2,
    id_reserva: 1001,
    nombres: "Ana",
    apellidos: "García",
    tipo_documento: "CC",
    numero_documento: "2030405060",
    fecha_nacimiento: "1992-03-10",
    nacionalidad: "Colombia",
    es_titular: false,
  },
];

export const emptyBookingForm = {
  id_turista: null,
  id_salida: null,
  cantidad_adultos: 1,
  cantidad_ninos: 0,
  precio_unitario: 0,
  descuento: 0,
  subtotal: 0,
  total: 0,
  estado: "PENDIENTE",
  motivo_cancelacion: "",
  observaciones: "",
  codigo_reserva: "",
  fecha_reserva: "",
  fecha_cancelacion: null,
  participantes: [],
};

export const emptyParticipanteForm = {
  nombres: "",
  apellidos: "",
  tipo_documento: "",
  numero_documento: "",
  fecha_nacimiento: "",
  nacionalidad: "",
  es_titular: false,
};

function generarCodigoReserva(fecha = new Date()) {
  const year = fecha.getFullYear();
  const num = (mockReservas.length + 1).toString().padStart(4, "0");
  return `RES-${year}-${num}`;
}

export const TURISTA_OPTIONS = Array.isArray(mockClientes)
  ? mockClientes.map((c) => ({
      value: c.id_turista ?? c.id,
      label: c.nombre_completo ?? [c.nombre, c.apellido].filter(Boolean).join(" "),
      email: c.correo ?? c.email,
      phone: c.telefono ?? c.phone,
    }))
  : [];

export function buildSalidaOptions() {
  return (mockSalidasTour ?? []).map((s) => {
    const tour = (mockTours ?? []).find((t) => t.id_tour === s.id_tour);
    const guia = (mockGuides ?? []).find((g) => g.id === s.id_guia || g.id_guia === s.id_guia);
    const tourNombre = tour?.nombre ?? tour?.name ?? "Tour sin nombre";
    const precio = tour?.precio_base ?? tour?.price ?? 0;
    const label =
      `${tourNombre} · ${s.fecha_salida ?? s.date} · ${s.hora_salida ?? "09:00"} · ${s.cupos_disponibles ?? 0} cupos disp.`;
    return {
      value: s.id_salida,
      label,
      tourNombre,
      fecha: s.fecha_salida ?? s.date,
      hora: s.hora_salida ?? "09:00",
      cuposDisponibles: s.cupos_disponibles ?? 0,
      precioUnitario: Number(precio ?? 0),
      id_guia: s.id_guia,
      guiaNombre: guia?.name ?? "",
    };
  });
}

export const SALIDA_OPTIONS = buildSalidaOptions();

export const bookingServices = {
  async fetchReservas() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("reservas")
          .select(
            `
            id_reserva,
            id_turista,
            id_salida,
            codigo_reserva,
            fecha_reserva,
            fecha_cancelacion,
            cantidad_adultos,
            cantidad_ninos,
            precio_unitario,
            descuento,
            subtotal,
            total,
            estado,
            motivo_cancelacion,
            observaciones,
            turistas:turistas!reservas_id_turista_fkey (
              id_usuario,
              tipo_documento,
              numero_documento,
              usuarios:usuarios!turistas_id_usuario_fkey (
                nombre, apellido, correo, telefono
              )
            ),
            salidas_tour:salidas_tour!reservas_id_salida_fkey (
              id_salida, id_tour, id_guia,
              fecha_salida, hora_salida, cupos_disponibles,
              tours:tours!salidas_tour_id_tour_fkey (nombre, precio_base)
            )
          `
          )
          .order("fecha_reserva", { ascending: false });
        if (error) throw error;
        return (data ?? []).map((r) => {
          const u = r.turistas?.usuarios ?? {};
          const s = r.salidas_tour ?? {};
          const t = s.tours ?? {};
          return {
            ...r,
            turista_nombre: [u.nombre, u.apellido].filter(Boolean).join(" "),
            turista_correo: u.correo ?? "",
            turista_telefono: u.telefono ?? "",
            salida_tour_nombre: t.nombre ?? "",
            salida_fecha: s.fecha_salida ?? "",
            salida_hora: s.hora_salida ?? "",
            salida_cupos_disponibles: s.cupos_disponibles ?? 0,
            guia_nombre: "",
          };
        });
      } catch (err) {
        console.error("Error fetching reservas:", err);
      }
    }
    return withMockDelay([...mockReservas], 400);
  },

  async fetchParticipantes(id_reserva) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("reserva_participantes")
          .select("*")
          .eq("id_reserva", id_reserva);
        if (error) throw error;
        return data ?? [];
      } catch (err) {
        console.error("Error fetching participantes:", err);
      }
    }
    return withMockDelay(
      mockReservaParticipantes.filter((p) => p.id_reserva === Number(id_reserva)),
      200
    );
  },

  async createReserva(payload, participantes = []) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: reserva, error: rErr } = await supabase
          .from("reservas")
          .insert([payload])
          .select()
          .single();
        if (rErr) throw rErr;
        if (participantes && participantes.length > 0) {
          const rows = participantes.map((p) => ({ ...p, id_reserva: reserva.id_reserva }));
          const { error: pErr } = await supabase.from("reserva_participantes").insert(rows);
          if (pErr) throw pErr;
        }
        return reserva;
      } catch (err) {
        console.error("Error creating reserva:", err);
      }
    }
    const nextId = mockReservas.length > 0 ? Math.max(...mockReservas.map((r) => r.id_reserva)) + 1 : 1001;
    const salida = SALIDA_OPTIONS.find((s) => Number(s.value) === Number(payload.id_salida));
    const turista = TURISTA_OPTIONS.find((t) => Number(t.value) === Number(payload.id_turista));
    const subtotal =
      (Number(payload.cantidad_adultos ?? 0) + Number(payload.cantidad_ninos ?? 0)) *
        Number(payload.precio_unitario ?? 0) -
      Number(payload.descuento ?? 0);
    const nuevo = {
      id_reserva: nextId,
      codigo_reserva: generarCodigoReserva(),
      fecha_reserva: new Date().toISOString().split("T")[0],
      fecha_cancelacion: payload.estado === "CANCELADA" ? new Date().toISOString().split("T")[0] : null,
      ...payload,
      subtotal: subtotal > 0 ? subtotal : 0,
      total: subtotal > 0 ? subtotal : 0,
      turista_nombre: turista?.label ?? "Turista",
      turista_correo: turista?.email ?? "",
      turista_telefono: turista?.phone ?? "",
      salida_tour_nombre: salida?.tourNombre ?? "",
      salida_fecha: salida?.fecha ?? "",
      salida_hora: salida?.hora ?? "",
      salida_cupos_disponibles: salida?.cuposDisponibles ?? 0,
      guia_nombre: salida?.guiaNombre ?? "",
    };
    mockReservas.push(nuevo);
    if (participantes && participantes.length > 0) {
      participantes.forEach((p, idx) => {
        const nextPId = (mockReservaParticipantes.at(-1)?.id_participante ?? 0) + idx + 1;
        mockReservaParticipantes.push({
          id_participante: nextPId,
          id_reserva: nextId,
          ...p,
        });
      });
    }
    if (salida && salida.cuposDisponibles != null) {
      const totalPax = Number(payload.cantidad_adultos ?? 0) + Number(payload.cantidad_ninos ?? 0);
      const idx = mockSalidasTour.findIndex((s) => s.id_salida === salida.value);
      if (idx >= 0) {
        mockSalidasTour[idx].cupos_disponibles = Math.max(
          0,
          (mockSalidasTour[idx].cupos_disponibles ?? 0) - totalPax
        );
      }
    }
    return withMockDelay(nuevo, 300);
  },

  async updateReserva(id_reserva, payload) {
    if (isSupabaseConfigured && supabase) {
      try {
        const updatePayload = { ...payload };
        if (updatePayload.estado === "CANCELADA" && !updatePayload.fecha_cancelacion) {
          updatePayload.fecha_cancelacion = new Date().toISOString().split("T")[0];
        }
        const { error } = await supabase
          .from("reservas")
          .update(updatePayload)
          .eq("id_reserva", id_reserva);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Error updating reserva:", err);
      }
    }
    const idx = mockReservas.findIndex((r) => r.id_reserva === Number(id_reserva));
    if (idx >= 0) {
      const current = mockReservas[idx];
      const subtotal =
        (Number(payload.cantidad_adultos ?? current.cantidad_adultos) +
          Number(payload.cantidad_ninos ?? current.cantidad_ninos)) *
          Number(payload.precio_unitario ?? current.precio_unitario) -
        Number(payload.descuento ?? current.descuento);
      const merged = {
        ...current,
        ...payload,
        subtotal: subtotal > 0 ? subtotal : 0,
        total: subtotal > 0 ? subtotal : 0,
      };
      if (merged.estado === "CANCELADA" && !merged.fecha_cancelacion) {
        merged.fecha_cancelacion = new Date().toISOString().split("T")[0];
      }
      mockReservas[idx] = merged;
      return withMockDelay(merged, 300);
    }
    return null;
  },

  async cambiarEstadoReserva(id_reserva, nuevoEstado, motivo_cancelacion = null) {
    const payload = { estado: nuevoEstado };
    if (nuevoEstado === "CANCELADA") {
      payload.motivo_cancelacion = motivo_cancelacion ?? "Cancelación manual";
      payload.fecha_cancelacion = new Date().toISOString().split("T")[0];
    }
    const updated = await bookingServices.updateReserva(id_reserva, payload);
    if (nuevoEstado === "CANCELADA") {
      const idx = mockReservas.findIndex((r) => r.id_reserva === Number(id_reserva));
      if (idx >= 0) {
        const r = mockReservas[idx];
        const sIdx = mockSalidasTour.findIndex((s) => s.id_salida === Number(r.id_salida));
        if (sIdx >= 0) {
          const totalPax = Number(r.cantidad_adultos ?? 0) + Number(r.cantidad_ninos ?? 0);
          mockSalidasTour[sIdx].cupos_disponibles =
            (mockSalidasTour[sIdx].cupos_disponibles ?? 0) + totalPax;
        }
      }
    }
    return updated;
  },

  async deleteReserva(id_reserva) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("reserva_participantes").delete().eq("id_reserva", id_reserva);
        const { error } = await supabase.from("reservas").delete().eq("id_reserva", id_reserva);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Error deleting reserva:", err);
        return false;
      }
    }
    const idx = mockReservas.findIndex((r) => r.id_reserva === Number(id_reserva));
    if (idx >= 0) {
      const r = mockReservas[idx];
      if (r.estado !== "CANCELADA") {
        const sIdx = mockSalidasTour.findIndex((s) => s.id_salida === Number(r.id_salida));
        if (sIdx >= 0) {
          const totalPax = Number(r.cantidad_adultos ?? 0) + Number(r.cantidad_ninos ?? 0);
          mockSalidasTour[sIdx].cupos_disponibles =
            (mockSalidasTour[sIdx].cupos_disponibles ?? 0) + totalPax;
        }
      }
      mockReservas.splice(idx, 1);
      for (let i = mockReservaParticipantes.length - 1; i >= 0; i--) {
        if (mockReservaParticipantes[i].id_reserva === Number(id_reserva)) {
          mockReservaParticipantes.splice(i, 1);
        }
      }
    }
    return withMockDelay(true, 250);
  },

  computeStats(reservas, filteredCount) {
    const total = reservas.length;
    const confirmadas = reservas.filter((b) => b.estado === "CONFIRMADA").length;
    const pendientes = reservas.filter((b) => b.estado === "PENDIENTE").length;
    const canceladas = reservas.filter((b) => b.estado === "CANCELADA").length;
    const completadas = reservas.filter((b) => b.estado === "COMPLETADA").length;
    const revenueNum = reservas
      .filter((b) => b.estado !== "CANCELADA")
      .reduce((s, b) => s + Number(b.total ?? 0), 0);
    return {
      total,
      confirmadas,
      pendientes,
      canceladas,
      completadas,
      revenue: `$${revenueNum.toLocaleString("es-CO")}`,
      filtered: filteredCount,
    };
  },

  exportCSV(reservas) {
    const headers = [
      "ID Reserva",
      "Código",
      "Turista",
      "Correo",
      "Teléfono",
      "Tour / Salida",
      "Fecha Salida",
      "Hora",
      "Adultos",
      "Niños",
      "Precio Unitario",
      "Descuento",
      "Subtotal",
      "Total",
      "Estado",
      "Motivo Cancelación",
      "Guía",
      "Fecha Reserva",
      "Observaciones",
    ];
    const csv = [
      headers.join(","),
      ...reservas.map((b) =>
        [
          b.id_reserva ?? b.id ?? "",
          b.codigo_reserva ?? "",
          `"${b.turista_nombre ?? ""}"`,
          `"${b.turista_correo ?? ""}"`,
          `"${b.turista_telefono ?? ""}"`,
          `"${b.salida_tour_nombre ?? ""}"`,
          b.salida_fecha ?? "",
          b.salida_hora ?? "",
          b.cantidad_adultos ?? 0,
          b.cantidad_ninos ?? 0,
          Number(b.precio_unitario ?? 0),
          Number(b.descuento ?? 0),
          Number(b.subtotal ?? 0),
          Number(b.total ?? 0),
          b.estado ?? "",
          `"${(b.motivo_cancelacion ?? "").replace(/"/g, '""')}"`,
          `"${b.guia_nombre ?? ""}"`,
          b.fecha_reserva ?? "",
          `"${(b.observaciones ?? "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservas-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};

export { mockTours, mockClientes, mockGuides };

export default bookingServices;
