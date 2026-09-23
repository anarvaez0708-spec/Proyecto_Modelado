import { supabase, isSupabaseConfigured, withMockDelay } from "@/shared/lib/supabase";
import { api, isApiConfigured } from "@/shared/lib/api";
import { ESTADO_TOUR_OPTIONS, ESTADO_SALIDA_OPTIONS } from "@/shared/constants/dbEnums";

const TOURS_STORAGE_KEY = "artetours_mock_tours";

export const mockCategoriasTour = [
    {
        id_categoria: 1,
        nombre: "Cultural",
        descripcion: "Tours que combinan historia, cultura local y tradición.",
        color: "#2563eb",
        activo: true,
    },
    {
        id_categoria: 2,
        nombre: "City Tour",
        descripcion: "Recorridos urbanos por los puntos emblemáticos de la ciudad.",
        color: "#06b6d4",
        activo: true,
    },
    {
        id_categoria: 3,
        nombre: "Histórico",
        descripcion: "Rutas guiadas por hechos y personajes históricos.",
        color: "#8b5cf6",
        activo: true,
    },
    {
        id_categoria: 4,
        nombre: "Food Tour",
        descripcion: "Experiencias gastronómicas con degustaciones incluidas.",
        color: "#22c55e",
        activo: true,
    },
    {
        id_categoria: 5,
        nombre: "Aventura",
        descripcion: "Actividades al aire libre y experiencias emocionantes.",
        color: "#f97316",
        activo: true,
    },
    {
        id_categoria: 6,
        nombre: "Arte Urbano",
        descripcion: "Grafiti y murales por los barrios más creativos.",
        color: "#ec4899",
        activo: true,
    },
];

export const mockTours = [
    {
        id_tour: 1,
        nombre: "Comuna 13 Tour",
        imagen_url: "https://images.unsplash.com/photo-1693669029454-ab14dd80faaa?w=800&h=500&fit=crop&auto=format",
        id_categoria: 1,
        duracion_horas: 3,
        capacidad_maxima: 12,
        precio_base: 45000,
        estado: "ACTIVO",
        descripcion:
            "Recorrido histórico y artístico por la Comuna 13, visitando murales, escaleras eléctricas y conociendo la transformación social del barrio.",
        punto_encuentro: "Estación San Javier (Metro)",
        destino: "Comuna 13, Medellín",
        dificultad: "MEDIO",
        edad_minima: 8,
        edad_maxima: 80,
        latitud: 6.2442,
        longitud: -75.5812,
        incluye: "Guía bilingüe, audífonos, café de bienvenida",
        no_incluye: "Almuerzo, transporte desde hoteles",
        recomendaciones: "Zapatos cómodos, gorra, bloqueador solar, agua",
        politica_cancelacion: "Cancelación con 48h de antelación para reembolso completo.",
    },
    {
        id_tour: 2,
        nombre: "City Tour Clásico",
        imagen_url: "https://images.unsplash.com/photo-1665419381995-0154f249f41f?w=800&h=500&fit=crop&auto=format",
        id_categoria: 2,
        duracion_horas: 4,
        capacidad_maxima: 15,
        precio_base: 60000,
        estado: "ACTIVO",
        descripcion:
            "Los lugares más emblemáticos de Medellín: Plaza Botero, Centro, Poblado, Parque de los Pies Descalzos y más.",
        punto_encuentro: "Plaza Botero",
        destino: "Centro y Zona Rosa de Medellín",
        dificultad: "FÁCIL",
        edad_minima: null,
        edad_maxima: null,
        latitud: 6.2518,
        longitud: -75.5636,
        incluye: "Transporte en bus, guía, botella de agua",
        no_incluye: "Almuerzo, entradas a museos",
        recomendaciones: "Dinero en efectivo para souvenirs",
        politica_cancelacion: "24h de antelación para reembolso del 80%.",
    },
    {
        id_tour: 3,
        nombre: "Pablo Escobar & Historia",
        id_categoria: 3,
        duracion_horas: 5,
        capacidad_maxima: 10,
        precio_base: 80000,
        estado: "ACTIVO",
        descripcion:
            "Ruta histórica sobre los años 80 y 90 en Medellín: barrio Envigado, Monaco, Loma y contexto histórico.",
        punto_encuentro: "Estación Poblado (Metro)",
        destino: "Envigado y El Poblado",
        dificultad: "MEDIO",
        edad_minima: 16,
        edad_maxima: null,
        latitud: 6.2038,
        longitud: -75.5684,
        incluye: "Guía experto en historia, transporte, agua mineral",
        no_incluye: "Comidas, entradas a sitios privados",
        recomendaciones: "Cámara fotográfica, documento de identidad",
        politica_cancelacion: "Cancelación 72h antes: 100% reembolso.",
    },
    {
        id_tour: 4,
        nombre: "Food Tour San Joaquín",
        imagen_url: "https://images.unsplash.com/photo-1723693407562-bb4fcae76797?w=800&h=500&fit=crop&auto=format",
        id_categoria: 4,
        duracion_horas: 3.5,
        capacidad_maxima: 8,
        precio_base: 55000,
        estado: "ACTIVO",
        descripcion:
            "Degustación de platos típicos en el barrio San Joaquín: arepas, empanadas, bandeja paisa y postres tradicionales.",
        punto_encuentro: "Parque de San Joaquín",
        destino: "Barrio San Joaquín",
        dificultad: "FÁCIL",
        edad_minima: 10,
        edad_maxima: null,
        latitud: 6.2541,
        longitud: -75.5695,
        incluye: "5 degustaciones, guía gastronómico",
        no_incluye: "Bebidas alcohólicas",
        recomendaciones: "Llegar con hambre, alergias informar con antelación",
        politica_cancelacion: "48h antes para reembolso completo.",
    },
    {
        id_tour: 5,
        nombre: "Parque Arví Tour",
        id_categoria: 5,
        duracion_horas: 6,
        capacidad_maxima: 12,
        precio_base: 70000,
        estado: "INACTIVO",
        descripcion:
            "Tour ecológico por el Parque Arví: caminatas, laguna, flora y fauna nativa, almuerzo campestre.",
        punto_encuentro: "Estación Santo Domingo (MetroCable)",
        destino: "Parque Arví, Santa Elena",
        dificultad: "DIFÍCIL",
        edad_minima: 12,
        edad_maxima: 65,
        latitud: 6.279,
        longitud: -75.5056,
        incluye: "Guía naturalista, almuerzo, kit de senderismo",
        no_incluye: "Ropa impermeable, botas",
        recomendaciones: "Ropa de abrigo, botas, repelente",
        politica_cancelacion: "Sujeto a clima. Cancelación 48h.",
    },
    {
        id_tour: 6,
        nombre: "Grafiti Tour Comuna 13",
        imagen_url: "https://images.unsplash.com/photo-1693669029454-ab14dd80faaa?w=800&h=500&fit=crop&auto=format",
        id_categoria: 6,
        duracion_horas: 2,
        capacidad_maxima: 10,
        precio_base: 35000,
        estado: "ACTIVO",
        descripcion:
            "Conoce los mejores murales de la ciudad, la historia detrás de cada obra y los artistas locales.",
        punto_encuentro: "Estación San Javier (Metro)",
        destino: "Comuna 13, Zona de Murales",
        dificultad: "FÁCIL",
        edad_minima: null,
        edad_maxima: null,
        latitud: 6.2455,
        longitud: -75.5832,
        incluye: "Guía experto en arte urbano, mapa de murales",
        no_incluye: "Bebidas, snacks",
        recomendaciones: "Cámara, ropa fresca, gorra",
        politica_cancelacion: "24h antes: reembolso completo.",
    },
];

function syncMockTours(nextTours) {
    mockTours.splice(0, mockTours.length, ...nextTours);
}

export function getStoredTours() {
    if (typeof window === "undefined" || isSupabaseConfigured) {
        return [...mockTours];
    }
    try {
        const raw = window.localStorage.getItem(TOURS_STORAGE_KEY);
        if (!raw) {
            return [...mockTours];
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [...mockTours];
        }
        syncMockTours(parsed);
        return [...parsed];
    } catch {
        return [...mockTours];
    }
}

export function persistStoredTours(nextTours) {
    syncMockTours(nextTours);
    if (typeof window === "undefined" || isSupabaseConfigured) {
        return;
    }
    window.localStorage.setItem(TOURS_STORAGE_KEY, JSON.stringify(nextTours));
}

export const mockSalidasTour = [
    {
        id_salida: 1,
        id_tour: 1,
        id_guia: 1,
        fecha_salida: "2026-06-05",
        hora_salida: "09:00",
        hora_finalizacion: "12:00",
        cupo_maximo: 12,
        cupos_disponibles: 6,
        estado: "DISPONIBLE",
        observaciones: "Traer zapatos cómodos y gorra. Incluye café y empanada al final.",
    },
    {
        id_salida: 2,
        id_tour: 2,
        id_guia: 3,
        fecha_salida: "2026-06-05",
        hora_salida: "14:00",
        hora_finalizacion: "18:00",
        cupo_maximo: 15,
        cupos_disponibles: 13,
        estado: "DISPONIBLE",
        observaciones: "Transporte incluido en bus climatizado.",
    },
    {
        id_salida: 3,
        id_tour: 4,
        id_guia: 2,
        fecha_salida: "2026-06-04",
        hora_salida: "18:00",
        hora_finalizacion: "21:30",
        cupo_maximo: 8,
        cupos_disponibles: 0,
        estado: "COMPLETA",
        observaciones: "Alergias reportadas en lista de pasajeros.",
    },
    {
        id_salida: 4,
        id_tour: 6,
        id_guia: 1,
        fecha_salida: "2026-06-06",
        hora_salida: "10:00",
        hora_finalizacion: "12:00",
        cupo_maximo: 10,
        cupos_disponibles: 10,
        estado: "PROGRAMADA",
        observaciones: "Recorrido con artista invitado.",
    },
    {
        id_salida: 5,
        id_tour: 3,
        id_guia: 5,
        fecha_salida: "2026-06-03",
        hora_salida: "08:30",
        hora_finalizacion: "13:30",
        cupo_maximo: 10,
        cupos_disponibles: 10,
        estado: "FINALIZADA",
        observaciones: "Tour completado sin novedades.",
    },
    {
        id_salida: 6,
        id_tour: 5,
        id_guia: null,
        fecha_salida: "2026-06-10",
        hora_salida: "07:00",
        hora_finalizacion: "",
        cupo_maximo: 12,
        cupos_disponibles: 12,
        estado: "CANCELADA",
        observaciones: "Cancelado por clima adverso.",
    },
];

export const mockResenasTour = [
    {
        id_resena: 1,
        id_tour: 1,
        calificacion: 5,
    },
];

export const emptyTourForm = {
    nombre: "",
    id_categoria: null,
    duracion_horas: "",
    capacidad_maxima: 12,
    precio_base: 0,
    estado: "BORRADOR",
    descripcion: "",
    punto_encuentro: "",
    destino: "",
    dificultad: "",
    edad_minima: null,
    edad_maxima: null,
    latitud: "",
    longitud: "",
    incluye: "",
    no_incluye: "",
    recomendaciones: "",
    politica_cancelacion: "",
};

export const emptyTourTypeForm = {
    nombre: "",
    descripcion: "",
    color: "",
    activo: true,
};

export const emptyGroupForm = {
    id_tour: null,
    id_guia: null,
    fecha_salida: new Date().toISOString().split("T")[0],
    hora_salida: "09:00",
    hora_finalizacion: "",
    cupo_maximo: 12,
    cupos_disponibles: 12,
    estado: "PROGRAMADA",
    observaciones: "",
};

export const SALIDA_STATUS_OPTIONS = [
    { value: "all", label: "Todos" },
    ...ESTADO_SALIDA_OPTIONS,
];

export const TOUR_STATUS_OPTIONS = [
    { value: "all", label: "Todos" },
    ...ESTADO_TOUR_OPTIONS,
];

export function getTourImageUrl(tour) {
    if (!tour) return "";
    if (tour.imagen_url) return tour.imagen_url;
    if (tour.image_url) return tour.image_url;
    if (tour.foto_url) return tour.foto_url;
    if (Array.isArray(tour.tour_imagenes) && tour.tour_imagenes.length > 0) {
        const principal = tour.tour_imagenes.find((image) => image.principal);
        const candidate = principal ?? tour.tour_imagenes[0];
        return candidate?.url ?? candidate?.imagen_url ?? candidate?.foto_url ?? "";
    }
    return "";
}

export function getTourReviewStats(tourId) {
    const currentTourId = Number(tourId);
    const reviews = (mockResenasTour ?? []).filter((review) => Number(review.id_tour) === currentTourId);
    if (reviews.length === 0) {
        return { rating: null, reviews: 0 };
    }
    const total = reviews.reduce((sum, review) => sum + Number(review.calificacion ?? 0), 0);
    return {
        rating: Number((total / reviews.length).toFixed(1)),
        reviews: reviews.length,
    };
}

export const tourServices = {
    async fetchTours() {
        if (isApiConfigured) return api.get("/tours");
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("tours")
                    .select("*")
                    .order("nombre");
                if (error) throw error;
                return data ?? [];
            } catch (err) {
                console.error("Error fetching tours:", err);
            }
        }
        return withMockDelay([...mockTours], 400);
    },

    async createTour(payload) {
        if (isApiConfigured) return api.post("/tours", payload);
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("tours")
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("Error creating tour:", err);
            }
        }
        const nuevo = {
            ...payload,
            id_tour: Date.now(),
        };
        mockTours.push(nuevo);
        return withMockDelay(nuevo, 300);
    },

    async updateTour(id_tour, payload) {
        if (isApiConfigured) return api.put(`/tours/${id_tour}`, payload);
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("tours")
                    .update(payload)
                    .eq("id_tour", id_tour)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("Error updating tour:", err);
            }
        }
        const idx = mockTours.findIndex((t) => t.id_tour === Number(id_tour));
        if (idx >= 0) {
            mockTours[idx] = { ...mockTours[idx], ...payload };
            return withMockDelay(mockTours[idx], 300);
        }
        return null;
    },

    async deleteTour(id_tour) {
        if (isApiConfigured) {
            await api.delete(`/tours/${id_tour}`);
            return true;
        }
        if (isSupabaseConfigured && supabase) {
            try {
                const { error } = await supabase
                    .from("tours")
                    .delete()
                    .eq("id_tour", id_tour);
                if (error) throw error;
                return true;
            } catch (err) {
                console.error("Error deleting tour:", err);
                return false;
            }
        }
        const idx = mockTours.findIndex((t) => t.id_tour === Number(id_tour));
        if (idx >= 0) mockTours.splice(idx, 1);
        return withMockDelay(true, 250);
    },

    async fetchCategoriasTour() {
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("categorias_tour")
                    .select("*")
                    .order("nombre");
                if (error) throw error;
                return data ?? [];
            } catch (err) {
                console.error("Error fetching categorias_tour:", err);
            }
        }
        return withMockDelay([...mockCategoriasTour], 400);
    },

    async createCategoriaTour(payload) {
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("categorias_tour")
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("Error creating categoria:", err);
            }
        }
        const nuevo = {
            ...payload,
            id_categoria: Date.now(),
        };
        mockCategoriasTour.push(nuevo);
        return withMockDelay(nuevo, 300);
    },

    async updateCategoriaTour(id_categoria, payload) {
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("categorias_tour")
                    .update(payload)
                    .eq("id_categoria", id_categoria)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("Error updating categoria:", err);
            }
        }
        const idx = mockCategoriasTour.findIndex(
            (c) => c.id_categoria === Number(id_categoria)
        );
        if (idx >= 0) {
            mockCategoriasTour[idx] = { ...mockCategoriasTour[idx], ...payload };
            return withMockDelay(mockCategoriasTour[idx], 300);
        }
        return null;
    },

    async deleteCategoriaTour(id_categoria) {
        if (isSupabaseConfigured && supabase) {
            try {
                const { error } = await supabase
                    .from("categorias_tour")
                    .delete()
                    .eq("id_categoria", id_categoria);
                if (error) throw error;
                return true;
            } catch (err) {
                console.error("Error deleting categoria:", err);
                return false;
            }
        }
        const idx = mockCategoriasTour.findIndex(
            (c) => c.id_categoria === Number(id_categoria)
        );
        if (idx >= 0) mockCategoriasTour.splice(idx, 1);
        return withMockDelay(true, 250);
    },

    async fetchSalidasTour() {
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("salidas_tour")
                    .select("*")
                    .order("fecha_salida", { ascending: false });
                if (error) throw error;
                return data ?? [];
            } catch (err) {
                console.error("Error fetching salidas_tour:", err);
            }
        }
        return withMockDelay([...mockSalidasTour], 400);
    },

    async createSalidaTour(payload) {
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("salidas_tour")
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("Error creating salida:", err);
            }
        }
        const nuevo = {
            ...payload,
            id_salida: Date.now(),
        };
        mockSalidasTour.push(nuevo);
        return withMockDelay(nuevo, 300);
    },

    async updateSalidaTour(id_salida, payload) {
        if (isSupabaseConfigured && supabase) {
            try {
                const { data, error } = await supabase
                    .from("salidas_tour")
                    .update(payload)
                    .eq("id_salida", id_salida)
                    .select()
                    .single();
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("Error updating salida:", err);
            }
        }
        const idx = mockSalidasTour.findIndex(
            (s) => s.id_salida === Number(id_salida)
        );
        if (idx >= 0) {
            mockSalidasTour[idx] = { ...mockSalidasTour[idx], ...payload };
            return withMockDelay(mockSalidasTour[idx], 300);
        }
        return null;
    },

    async deleteSalidaTour(id_salida) {
        if (isSupabaseConfigured && supabase) {
            try {
                const { error } = await supabase
                    .from("salidas_tour")
                    .delete()
                    .eq("id_salida", id_salida);
                if (error) throw error;
                return true;
            } catch (err) {
                console.error("Error deleting salida:", err);
                return false;
            }
        }
        const idx = mockSalidasTour.findIndex(
            (s) => s.id_salida === Number(id_salida)
        );
        if (idx >= 0) mockSalidasTour.splice(idx, 1);
        return withMockDelay(true, 250);
    },

    computeTourStats(tours, filteredCount) {
        return {
            total: tours.length,
            activos: tours.filter((t) => t.estado === "ACTIVO").length,
            inactivos: tours.filter((t) => t.estado === "INACTIVO").length,
            borradores: tours.filter((t) => t.estado === "BORRADOR").length,
            avgPrice:
                tours.length > 0
                    ? `$${Math.round(
                          tours.reduce((s, t) => s + (t.precio_base ?? 0), 0) /
                              tours.length
                      ).toLocaleString()}`
                    : "$0",
            filtered: filteredCount,
        };
    },

    computeTypeStats(types, filteredCount) {
        const activos = types.filter((t) => t.activo).length;
        return {
            total: types.length,
            activos,
            inactivos: types.length - activos,
            filtered: filteredCount,
        };
    },

    computeGroupStats(salidas, filteredCount) {
        const pax = salidas.reduce(
            (s, g) => s + ((g.cupo_maximo ?? 0) - (g.cupos_disponibles ?? 0)),
            0
        );
        return {
            total: salidas.length,
            totalParticipantes: pax,
            disponibles: salidas.filter((g) => g.estado === "DISPONIBLE")
                .length,
            completas: salidas.filter((g) => g.estado === "COMPLETA").length,
            programadas: salidas.filter((g) => g.estado === "PROGRAMADA")
                .length,
            finalizadas: salidas.filter((g) => g.estado === "FINALIZADA")
                .length,
            canceladas: salidas.filter((g) => g.estado === "CANCELADA")
                .length,
            filtered: filteredCount,
        };
    },

    occupancyPercentage(salida) {
        const max = salida.cupo_maximo ?? 0;
        const disp = salida.cupos_disponibles ?? 0;
        const ocupados = max - disp;
        if (max === 0) return 0;
        return Math.round((ocupados / max) * 100);
    },

    occupancyColor(pct) {
        if (pct >= 80) return "bg-success";
        if (pct >= 50) return "bg-warning";
        return "bg-primary";
    },

    exportToursCSV(tours) {
        const headers = [
            "ID",
            "Nombre",
            "Categoria ID",
            "Duracion",
            "Capacidad",
            "Precio",
            "Estado",
            "Descripcion",
            "Punto Encuentro",
            "Destino",
        ];
        const csv = [
            headers.join(","),
            ...tours.map((t) =>
                [
                    t.id_tour ?? t.id,
                    t.nombre ?? t.name,
                    t.id_categoria ?? "",
                    t.duracion_horas ?? t.duration,
                    t.capacidad_maxima ?? t.capacity,
                    t.precio_base ?? t.price,
                    t.estado ?? t.status,
                    `"${(t.descripcion ?? "").replace(/"/g, '""')}"`,
                    `"${(t.punto_encuentro ?? "").replace(/"/g, '""')}"`,
                    `"${(t.destino ?? "").replace(/"/g, '""')}"`,
                ].join(",")
            ),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tours-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    },

    exportSalidasCSV(salidas) {
        const headers = [
            "ID",
            "Tour ID",
            "Guia ID",
            "Fecha",
            "Hora Salida",
            "Hora Fin",
            "Cupo Max",
            "Disponibles",
            "Estado",
            "Observaciones",
        ];
        const csv = [
            headers.join(","),
            ...salidas.map((s) =>
                [
                    s.id_salida ?? s.id,
                    s.id_tour ?? "",
                    s.id_guia ?? "",
                    s.fecha_salida ?? s.date,
                    s.hora_salida ?? s.startTime,
                    s.hora_finalizacion ?? "",
                    s.cupo_maximo ?? s.maxCapacity,
                    s.cupos_disponibles ?? "",
                    s.estado ?? s.status,
                    `"${(s.observaciones ?? "").replace(/"/g, '""')}"`,
                ].join(",")
            ),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `salidas-tour-${
            new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
    },

    exportCategoriasCSV(categorias) {
        const headers = ["ID", "Nombre", "Descripcion", "Color", "Activo"];
        const csv = [
            headers.join(","),
            ...categorias.map((c) =>
                [
                    c.id_categoria ?? c.id,
                    c.nombre ?? c.name,
                    `"${(c.descripcion ?? "").replace(/"/g, '""')}"`,
                    c.color ?? "",
                    c.activo ? "Sí" : "No",
                ].join(",")
            ),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `categorias-tour-${
            new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
    },
};

export default tourServices;
