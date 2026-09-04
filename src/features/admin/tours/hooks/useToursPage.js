import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
    mockTours,
    getStoredTours,
    mockCategoriasTour,
    mockSalidasTour,
    emptyTourForm,
    emptyTourTypeForm,
    emptyGroupForm,
    tourServices,
    persistStoredTours,
    TOUR_STATUS_OPTIONS,
    SALIDA_STATUS_OPTIONS,
} from "../tourServices";
import { useSearchFilter } from "@/features/admin/hooks/useSearchFilter";
import { useCrudState } from "@/features/admin/hooks/useCrudState";
import { useDialogs } from "@/features/admin/hooks/useDialogs";
import { usePagination } from "@/features/admin/hooks/usePagination";
import { useSortableTable } from "@/features/admin/hooks/useSortableTable";
import { mockGuides } from "@/features/admin/guias/guideServices";

export function useToursPage() {
    const crud = useCrudState(getStoredTours(), {
        name: "Tour",
        idKey: "id_tour",
        onItemsChange: persistStoredTours,
    });
    const dialogs = useDialogs();
    const [formData, setFormData] = useState(emptyTourForm);
    const [filters, setFilters] = useState({
        estado: "all",
        id_categoria: "all",
    });
    const search = useSearchFilter(
        crud.items,
        (t) => [
            t.nombre,
            t.descripcion,
            t.destino,
            t.punto_encuentro,
            mockCategoriasTour.find(
                (c) => c.id_categoria === t.id_categoria
            )?.nombre ?? "",
        ],
        (t, f) => {
            const matchesStatus =
                f.estado === "all" || t.estado === f.estado;
            const matchesCategoria =
                f.id_categoria === "all" ||
                String(t.id_categoria) === String(f.id_categoria);
            return matchesStatus && matchesCategoria;
        },
        filters
    );
    const sortable = useSortableTable(search.filteredData);
    const pagination = usePagination(sortable.sortedItems, 10);
    const hasActiveFilters =
        filters.estado !== "all" ||
        filters.id_categoria !== "all" ||
        search.searchTerm !== "";

    const handleCreate = useCallback(
        (validData) => {
            crud.handleCreate(validData ?? formData);
            dialogs.closeCreate();
            setFormData(emptyTourForm);
        },
        [crud, formData, dialogs]
    );

    const handleEdit = useCallback(
        (validData) => {
            if (!dialogs.selectedItem) return;
            crud.handleEdit(
                dialogs.selectedItem.id_tour ?? dialogs.selectedItem.id,
                validData ?? formData
            );
            dialogs.closeEdit();
        },
        [crud, dialogs, formData]
    );

    const handleDelete = useCallback(() => {
        if (!dialogs.selectedItem) return;
        crud.handleDelete(
            dialogs.selectedItem.id_tour ?? dialogs.selectedItem.id
        );
        dialogs.closeDelete();
    }, [crud, dialogs]);

    const handleToggleStatus = useCallback((tour) => {
        const id = tour.id_tour ?? tour.id;
        const currentStatus = tour.estado ?? tour.status;
        const nextStatus =
            currentStatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
        crud.handleEdit(id, { estado: nextStatus });
    }, [crud]);

    const openCreate = useCallback(() => {
        setFormData(emptyTourForm);
        dialogs.openCreate();
    }, [dialogs]);

    const openEdit = useCallback(
        (tour) => {
            setFormData({
                nombre: tour.nombre ?? tour.name ?? "",
                id_categoria: tour.id_categoria ?? null,
                duracion_horas: tour.duracion_horas ?? tour.duration ?? "",
                capacidad_maxima: tour.capacidad_maxima ?? tour.capacity ?? 12,
                precio_base: tour.precio_base ?? tour.price ?? 0,
                estado: tour.estado ?? tour.status ?? "BORRADOR",
                descripcion: tour.descripcion ?? tour.description ?? "",
                punto_encuentro: tour.punto_encuentro ?? "",
                destino: tour.destino ?? "",
                dificultad: tour.dificultad ?? "",
                edad_minima: tour.edad_minima ?? null,
                edad_maxima: tour.edad_maxima ?? null,
                latitud: tour.latitud ?? "",
                longitud: tour.longitud ?? "",
                incluye: tour.incluye ?? "",
                no_incluye: tour.no_incluye ?? "",
                recomendaciones: tour.recomendaciones ?? "",
                politica_cancelacion: tour.politica_cancelacion ?? "",
            });
            dialogs.openEdit(tour);
        },
        [dialogs]
    );

    const clearFilters = useCallback(() => {
        setFilters({ estado: "all", id_categoria: "all" });
        search.setSearchTerm("");
        sortable.resetSort();
        toast.info("Filtros limpiados");
    }, [search, sortable]);

    const handleExportCSV = useCallback(() => {
        tourServices.exportToursCSV(search.filteredData);
        toast.success("Datos exportados a CSV");
    }, [search]);

    const stats = tourServices.computeTourStats(
        crud.items,
        search.filteredData.length
    );

    return {
        tours: crud.items,
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

export function useGroupsPage() {
    const crud = useCrudState(mockSalidasTour, { name: "Salida" });
    const dialogs = useDialogs();
    const [formData, setFormData] = useState(emptyGroupForm);
    const [filters, setFilters] = useState({
        estado: "all",
        id_guia: "all",
        id_tour: "all",
    });
    const search = useSearchFilter(
        crud.items,
        (s) => [
            mockTours.find((t) => t.id_tour === s.id_tour)?.nombre ??
                s.id_tour,
            mockGuides.find((g) => g.id === s.id_guia)?.name ??
                s.id_guia,
            s.observaciones,
        ],
        (s, f) => {
            const matchesStatus =
                f.estado === "all" || s.estado === f.estado;
            const matchesGuide =
                f.id_guia === "all" ||
                String(s.id_guia) === String(f.id_guia);
            const matchesTour =
                f.id_tour === "all" ||
                String(s.id_tour) === String(f.id_tour);
            return matchesStatus && matchesGuide && matchesTour;
        },
        filters
    );
    const sortable = useSortableTable(search.filteredData);
    const pagination = usePagination(sortable.sortedItems, 10);
    const hasActiveFilters =
        filters.estado !== "all" ||
        filters.id_guia !== "all" ||
        filters.id_tour !== "all" ||
        search.searchTerm !== "";

    const handleCreate = useCallback(
        (validData) => {
            crud.handleCreate(validData ?? formData);
            dialogs.closeCreate();
            setFormData(emptyGroupForm);
        },
        [crud, formData, dialogs]
    );

    const handleEdit = useCallback(
        (validData) => {
            if (!dialogs.selectedItem) return;
            crud.handleEdit(
                dialogs.selectedItem.id_salida ?? dialogs.selectedItem.id,
                validData ?? formData
            );
            dialogs.closeEdit();
        },
        [crud, dialogs, formData]
    );

    const handleDelete = useCallback(() => {
        if (!dialogs.selectedItem) return;
        crud.handleDelete(
            dialogs.selectedItem.id_salida ?? dialogs.selectedItem.id
        );
        dialogs.closeDelete();
    }, [crud, dialogs]);

    const handleToggleStatus = useCallback((salida) => {
        const id = salida.id_salida ?? salida.id;
        const currentStatus = salida.estado ?? salida.status;
        let nextStatus = currentStatus;
        if (currentStatus === "PROGRAMADA") nextStatus = "DISPONIBLE";
        else if (currentStatus === "DISPONIBLE") nextStatus = "COMPLETA";
        crud.handleEdit(id, { estado: nextStatus });
        toast.success(`Estado actualizado a ${nextStatus}`);
    }, [crud]);

    const openCreate = useCallback(() => {
        setFormData(emptyGroupForm);
        dialogs.openCreate();
    }, [dialogs]);

    const openEdit = useCallback(
        (salida) => {
            setFormData({
                id_tour: salida.id_tour ?? null,
                id_guia: salida.id_guia ?? null,
                fecha_salida:
                    salida.fecha_salida ??
                    salida.date ??
                    new Date().toISOString().split("T")[0],
                hora_salida: salida.hora_salida ?? salida.startTime ?? "09:00",
                hora_finalizacion: salida.hora_finalizacion ?? "",
                cupo_maximo:
                    salida.cupo_maximo ?? salida.maxCapacity ?? 12,
                cupos_disponibles:
                    salida.cupos_disponibles ?? salida.maxCapacity ?? 12,
                estado: salida.estado ?? salida.status ?? "PROGRAMADA",
                observaciones:
                    salida.observaciones ?? salida.notes ?? "",
            });
            dialogs.openEdit(salida);
        },
        [dialogs]
    );

    const clearFilters = useCallback(() => {
        setFilters({ estado: "all", id_guia: "all", id_tour: "all" });
        search.setSearchTerm("");
        sortable.resetSort();
        toast.info("Filtros limpiados");
    }, [search, sortable]);

    const handleExportCSV = useCallback(() => {
        tourServices.exportSalidasCSV(search.filteredData);
        toast.success("Datos exportados a CSV");
    }, [search]);

    const stats = tourServices.computeGroupStats(
        crud.items,
        search.filteredData.length
    );

    return {
        groups: crud.items,
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

export function useTourTypesPage() {
    const crud = useCrudState(mockCategoriasTour, { name: "Categoría Tour" });
    const dialogs = useDialogs();
    const [formData, setFormData] = useState(emptyTourTypeForm);
    const [filters, setFilters] = useState({
        color: "all",
        activo: "all",
    });
    const search = useSearchFilter(
        crud.items,
        (t) => [t.nombre, t.descripcion],
        (t, f) => {
            const matchesColor =
                f.color === "all" || t.color === f.color;
            const matchesActivo =
                f.activo === "all" ||
                String(t.activo) === String(f.activo);
            return matchesColor && matchesActivo;
        },
        filters
    );
    const sortable = useSortableTable(search.filteredData);
    const pagination = usePagination(sortable.sortedItems, 10);
    const hasActiveFilters =
        filters.color !== "all" ||
        filters.activo !== "all" ||
        search.searchTerm !== "";

    const handleCreate = useCallback(() => {
        crud.handleCreate(formData);
        dialogs.closeCreate();
        setFormData(emptyTourTypeForm);
    }, [crud, formData, dialogs]);

    const handleEdit = useCallback(() => {
        if (!dialogs.selectedItem) return;
        crud.handleEdit(
            dialogs.selectedItem.id_categoria ?? dialogs.selectedItem.id,
            formData
        );
        dialogs.closeEdit();
    }, [crud, dialogs, formData]);

    const handleDelete = useCallback(() => {
        if (!dialogs.selectedItem) return;
        crud.handleDelete(
            dialogs.selectedItem.id_categoria ?? dialogs.selectedItem.id
        );
        dialogs.closeDelete();
    }, [crud, dialogs]);

    const openCreate = useCallback(() => {
        setFormData(emptyTourTypeForm);
        dialogs.openCreate();
    }, [dialogs]);

    const openEdit = useCallback(
        (type) => {
            setFormData({
                nombre: type.nombre ?? type.name ?? "",
                descripcion: type.descripcion ?? type.description ?? "",
                color: type.color ?? "",
                activo: type.activo !== undefined ? type.activo : true,
            });
            dialogs.openEdit(type);
        },
        [dialogs]
    );

    const clearFilters = useCallback(() => {
        setFilters({ color: "all", activo: "all" });
        search.setSearchTerm("");
        sortable.resetSort();
        toast.info("Filtros limpiados");
    }, [search, sortable]);

    const handleExportCSV = useCallback(() => {
        tourServices.exportCategoriasCSV(search.filteredData);
        toast.success("Datos exportados a CSV");
    }, [search]);

    const stats = tourServices.computeTypeStats(
        crud.items,
        search.filteredData.length
    );

    return {
        tourTypes: crud.items,
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
        openCreate,
        openEdit,
        clearFilters,
        handleExportCSV,
    };
}
