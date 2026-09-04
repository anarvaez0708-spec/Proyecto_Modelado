import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  getStoredReservas,
  mockClientes,
  emptyBookingForm,
  bookingServices,
  persistStoredReservas,
  SALIDA_OPTIONS,
} from "../bookingServices";
import { mockSalidasTour } from "@/features/admin/tours/tourServices";
import { useSearchFilter } from "@/features/admin/hooks/useSearchFilter";
import { useCrudState } from "@/features/admin/hooks/useCrudState";
import { useDialogs } from "@/features/admin/hooks/useDialogs";
import { usePagination } from "@/features/admin/hooks/usePagination";
import { useSortableTable } from "@/features/admin/hooks/useSortableTable";

function flattenReserva(r) {
  const id = r.id_reserva ?? r.id;
  const customer = r.turista_nombre ?? r.customer ?? "Turista";
  return {
    id,
    id_reserva: r.id_reserva ?? id,
    id_turista: r.id_turista,
    id_salida: r.id_salida,
    codigo_reserva: r.codigo_reserva ?? "",
    fecha_reserva: r.fecha_reserva ?? "",
    fecha_cancelacion: r.fecha_cancelacion ?? null,

    cantidad_adultos: r.cantidad_adultos ?? 1,
    cantidad_ninos: r.cantidad_ninos ?? 0,
    precio_unitario: r.precio_unitario ?? 0,
    descuento: r.descuento ?? 0,
    subtotal: r.subtotal ?? 0,
    total: r.total ?? 0,
    estado: r.estado ?? r.status ?? "PENDIENTE",
    status: r.estado ?? r.status ?? "PENDIENTE",
    motivo_cancelacion: r.motivo_cancelacion ?? null,
    observaciones: r.observaciones ?? "",

    customer,
    turista_nombre: customer,
    turista_correo: r.turista_correo ?? r.email ?? "",
    email: r.turista_correo ?? r.email ?? "",
    turista_telefono: r.turista_telefono ?? r.phone ?? "",
    phone: r.turista_telefono ?? r.phone ?? "",

    tour: r.salida_tour_nombre ?? r.tour ?? "",
    salida_tour_nombre: r.salida_tour_nombre ?? r.tour ?? "",
    date: r.salida_fecha ?? r.date ?? "",
    salida_fecha: r.salida_fecha ?? r.date ?? "",
    time: r.salida_hora ?? r.time ?? "",
    salida_hora: r.salida_hora ?? r.time ?? "",
    salida_cupos_disponibles: r.salida_cupos_disponibles,

    people: (r.cantidad_adultos ?? 0) + (r.cantidad_ninos ?? 0),
    guia_nombre: r.guia_nombre ?? r.guide ?? "",
    guide: r.guia_nombre ?? r.guide ?? "",
    participantes: r.participantes ?? [],
  };
}

function mergeFlatToBookingForm(flat) {
  return {
    id_turista: flat.id_turista ?? null,
    id_salida: flat.id_salida ?? null,
    cantidad_adultos: flat.cantidad_adultos ?? 1,
    cantidad_ninos: flat.cantidad_ninos ?? 0,
    precio_unitario: flat.precio_unitario ?? 0,
    descuento: flat.descuento ?? 0,
    subtotal: flat.subtotal ?? 0,
    total: flat.total ?? 0,
    estado: flat.estado ?? flat.status ?? "PENDIENTE",
    motivo_cancelacion: flat.motivo_cancelacion ?? "",
    observaciones: flat.observaciones ?? "",
    codigo_reserva: flat.codigo_reserva ?? "",
    fecha_reserva: flat.fecha_reserva ?? "",
    fecha_cancelacion: flat.fecha_cancelacion ?? null,
    participantes: flat.participantes ?? [],
  };
}

export function useBookingsPage() {
  const flatInitial = getStoredReservas().map(flattenReserva);
  const crud = useCrudState(flatInitial, {
    name: "Reserva",
    idKey: "id_reserva",
    onItemsChange: (nextItems) => {
      persistStoredReservas(
        nextItems.map((item) => ({
          id_reserva: item.id_reserva ?? item.id,
          id_turista: item.id_turista ?? null,
          id_salida: item.id_salida ?? null,
          codigo_reserva: item.codigo_reserva ?? "",
          fecha_reserva: item.fecha_reserva ?? "",
          fecha_cancelacion: item.fecha_cancelacion ?? null,
          cantidad_adultos: item.cantidad_adultos ?? 0,
          cantidad_ninos: item.cantidad_ninos ?? 0,
          precio_unitario: item.precio_unitario ?? 0,
          descuento: item.descuento ?? 0,
          subtotal: item.subtotal ?? 0,
          total: item.total ?? 0,
          estado: item.estado ?? item.status ?? "PENDIENTE",
          motivo_cancelacion: item.motivo_cancelacion ?? null,
          observaciones: item.observaciones ?? "",
          turista_nombre: item.turista_nombre ?? item.customer ?? "Turista",
          turista_correo: item.turista_correo ?? item.email ?? "",
          turista_telefono: item.turista_telefono ?? item.phone ?? "",
          salida_tour_nombre: item.salida_tour_nombre ?? item.tour ?? "",
          salida_fecha: item.salida_fecha ?? item.date ?? "",
          salida_hora: item.salida_hora ?? item.time ?? "",
          salida_cupos_disponibles: item.salida_cupos_disponibles ?? 0,
          guia_nombre: item.guia_nombre ?? item.guide ?? "",
          participantes: item.participantes ?? [],
        }))
      );
    },
  });
  const dialogs = useDialogs();
  const [formData, setFormData] = useState(emptyBookingForm);
  const [filters, setFilters] = useState({
    status: "all",
    dateFrom: "",
    dateTo: "",
    tour: "all",
  });
  const search = useSearchFilter(
    crud.items,
    (b) => [
      b.codigo_reserva,
      b.customer,
      b.tour,
      (b.id_reserva ?? b.id).toString(),
      b.email ?? "",
      b.phone ?? "",
    ],
    (b, f) => {
      const matchesStatus = f.status === "all" || (b.estado ?? b.status) === f.status;
      const matchesTour = f.tour === "all" || (b.tour ?? b.salida_tour_nombre) === f.tour;
      const fechaSalida = b.salida_fecha ?? b.date ?? "";
      const matchesDateFrom = !f.dateFrom || fechaSalida >= f.dateFrom;
      const matchesDateTo = !f.dateTo || fechaSalida <= f.dateTo;
      return matchesStatus && matchesTour && matchesDateFrom && matchesDateTo;
    },
    filters
  );
  const sortable = useSortableTable(search.filteredData);
  const pagination = usePagination(sortable.sortedItems, 10);
  const hasActiveFilters =
    filters.status !== "all" ||
    filters.tour !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    search.searchTerm !== "";

  const handleCreate = useCallback(() => {
    let reservaPayload;
    let participantes = [];
    if (formData && formData.reserva) {
      reservaPayload = formData.reserva;
      participantes = formData.participantes ?? [];
    } else {
      reservaPayload = formData;
    }
    const pax =
      Number(reservaPayload.cantidad_adultos ?? 0) +
      Number(reservaPayload.cantidad_ninos ?? 0);
    const pu = Number(reservaPayload.precio_unitario ?? 0);
    const desc = Number(reservaPayload.descuento ?? 0);
    const subtotal = Math.max(0, pax * pu - desc);
    const created = crud.handleCreate(
      flattenReserva({
        ...reservaPayload,
        subtotal,
        total: subtotal,
      })
    );
    dialogs.closeCreate();
    setFormData(emptyBookingForm);
    void participantes;
    return created;
  }, [crud, formData, dialogs]);

  const handleEdit = useCallback(() => {
    if (!dialogs.selectedItem) return;
    const id = dialogs.selectedItem.id_reserva ?? dialogs.selectedItem.id;
    let reservaPayload;
    let participantes = [];
    if (formData && formData.reserva) {
      reservaPayload = formData.reserva;
      participantes = formData.participantes ?? [];
    } else {
      reservaPayload = formData;
    }
    const current = dialogs.selectedItem;
    const pax =
      Number(reservaPayload.cantidad_adultos ?? current.cantidad_adultos ?? 0) +
      Number(reservaPayload.cantidad_ninos ?? current.cantidad_ninos ?? 0);
    const pu = Number(reservaPayload.precio_unitario ?? current.precio_unitario ?? 0);
    const desc = Number(reservaPayload.descuento ?? current.descuento ?? 0);
    const subtotal = Math.max(0, pax * pu - desc);
    const merged = {
      ...current,
      ...reservaPayload,
      subtotal,
      total: subtotal,
      participantes,
      status: reservaPayload.estado ?? reservaPayload.status ?? current.status,
    };
    crud.handleEdit(id, flattenReserva(merged));
    dialogs.closeEdit();
  }, [crud, dialogs, formData]);

  const handleDelete = useCallback(() => {
    if (!dialogs.selectedItem) return;
    const id = dialogs.selectedItem.id_reserva ?? dialogs.selectedItem.id;
    crud.handleDelete(id);
    dialogs.closeDelete();
  }, [crud, dialogs]);

  const handleToggleStatus = useCallback(
    (booking) => {
      const current = booking.estado ?? booking.status ?? "PENDIENTE";
      let nuevoEstado;
      if (current === "PENDIENTE") nuevoEstado = "CONFIRMADA";
      else if (current === "CONFIRMADA") nuevoEstado = "COMPLETADA";
      else if (current === "COMPLETADA") nuevoEstado = "CANCELADA";
      else nuevoEstado = "PENDIENTE";
      const id = booking.id_reserva ?? booking.id;
      const updates = { ...booking, estado: nuevoEstado, status: nuevoEstado };
      if (nuevoEstado === "CANCELADA" && !updates.motivo_cancelacion) {
        updates.motivo_cancelacion = "Cancelación manual rápida";
        updates.fecha_cancelacion = new Date().toISOString().split("T")[0];
      }
      crud.handleEdit(id, updates);
      toast.success(`Reserva marcada como ${nuevoEstado}`);
    },
    [crud]
  );

  const openCreate = useCallback(() => {
    setFormData(emptyBookingForm);
    dialogs.openCreate();
  }, [dialogs]);

  const openEdit = useCallback(
    (booking) => {
      setFormData(mergeFlatToBookingForm(booking));
      dialogs.openEdit(booking);
    },
    [dialogs]
  );

  const clearFilters = useCallback(() => {
    setFilters({ status: "all", dateFrom: "", dateTo: "", tour: "all" });
    search.setSearchTerm("");
    sortable.resetSort();
    toast.info("Filtros limpiados");
  }, [search, sortable]);

  const handleExportCSV = useCallback(() => {
    bookingServices.exportCSV(search.filteredData);
    toast.success("Datos exportados a CSV");
  }, [search]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const shouldCreate = params.get("create") === "1";
    const selectedTourId = Number(params.get("tourId"));
    if (!shouldCreate || !selectedTourId) return;

    const matchingSalidaBase = mockSalidasTour.find(
      (salida) => Number(salida.id_tour) === selectedTourId
    );
    const matchingSalida = matchingSalidaBase
      ? SALIDA_OPTIONS.find((salida) => Number(salida.value) === Number(matchingSalidaBase.id_salida))
      : undefined;

    const prefilledForm = matchingSalida
      ? {
          ...emptyBookingForm,
          id_salida: Number(matchingSalida.value),
          precio_unitario: Number(matchingSalida.precioUnitario ?? 0),
        }
      : emptyBookingForm;

    setFormData(prefilledForm);
    dialogs.openCreate();

    const nextUrl = `${window.location.pathname}`;
    window.history.replaceState({}, "", nextUrl);
  }, [dialogs]);

  const stats = bookingServices.computeStats(crud.items, search.filteredData.length);
  return {
    bookings: crud.items,
    items: pagination.paginatedItems,
    search,
    sortable,
    pagination,
    dialogs,
    formData,
    setFormData,
    filters,
    setFilters,
    hasActiveFilters,
    stats,
    handleCreate,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    openCreate,
    openEdit,
    clearFilters,
    handleExportCSV,
  };
}
