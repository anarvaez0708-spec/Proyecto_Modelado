import { useState } from "react";
import { toast } from "sonner";
export function useCrudState(initialItems, options = {}) {
    const [items, setItems] = useState(initialItems);
    const label = options.name ?? "Elemento";
    const idKey = options.idKey ?? "id";
    const getItemId = (item) => item?.[idKey] ?? item?.id;
    const handleCreate = (newItemData) => {
        const now = new Date().toISOString().split("T")[0];
        const numericIds = items
            .map((item) => Number(getItemId(item)))
            .filter((value) => Number.isFinite(value));
        const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
        const newItem = {
            ...(idKey !== "id" ? { id: nextId } : {}),
            [idKey]: nextId,
            createdAt: now,
            creado_en: now,
            ...newItemData,
        };
        const nextItems = [...items, newItem];
        setItems(nextItems);
        options.onItemsChange?.(nextItems);
        toast.success(options.onCreateMessage?.(newItem) ?? `${label} creado exitosamente`);
        return newItem;
    };
    const handleEdit = (id, updates) => {
        const nextItems = items.map((item) => (String(getItemId(item)) === String(id) ? { ...item, ...updates } : item));
        setItems(nextItems);
        options.onItemsChange?.(nextItems);
        const updated = nextItems.find((item) => String(getItemId(item)) === String(id));
        if (updated) {
            toast.success(options.onEditMessage?.(updated) ?? `${label} actualizado exitosamente`);
        }
    };
    const handleDelete = (id) => {
        const found = items.find((item) => String(getItemId(item)) === String(id));
        const nextItems = items.filter((item) => String(getItemId(item)) !== String(id));
        setItems(nextItems);
        options.onItemsChange?.(nextItems);
        if (found) {
            toast.success(options.onDeleteMessage?.(found) ?? `${label} eliminado exitosamente`);
        }
    };
    const handleToggleStatus = (id, statusKey = "status") => {
        const nextItems = items.map((item) => {
            if (String(getItemId(item)) !== String(id))
                return item;
            const current = item[statusKey];
            let newValue;
            let actionLabel;
            if (typeof current === "boolean") {
                newValue = !current;
                actionLabel = newValue ? "activado" : "desactivado";
            } else if (typeof current === "string") {
                const upper = current.toUpperCase();
                if (upper === "ACTIVO") {
                    newValue = "INACTIVO";
                    actionLabel = "desactivado";
                } else if (upper === "INACTIVO" || upper === "BLOQUEADO") {
                    newValue = "ACTIVO";
                    actionLabel = "activado";
                } else if (current === "active") {
                    newValue = "inactive";
                    actionLabel = "desactivado";
                } else {
                    newValue = "active";
                    actionLabel = "activado";
                }
            } else {
                newValue = "active";
                actionLabel = "activado";
            }
            const updated = { ...item, [statusKey]: newValue };
            toast.success(options.onToggleMessage?.(updated, newValue) ??
                `${label} ${actionLabel} exitosamente`);
            return updated;
        });
        setItems(nextItems);
        options.onItemsChange?.(nextItems);
    };
    return {
        items,
        setItems,
        handleCreate,
        handleEdit,
        handleDelete,
        handleToggleStatus,
    };
}
