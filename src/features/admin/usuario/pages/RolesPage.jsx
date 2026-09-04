import { DashboardLayout } from "@/features/admin/layout/components/AdminLayout";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Plus, Shield, Users, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { SearchToolbar } from "@/features/admin/components/SearchToolbar";
import { TablePagination } from "@/features/admin/components/TablePagination";
import { StatsGrid } from "@/features/admin/components/StatCard";
import { useRolesPage } from "../hooks/useUsersPage";
import { RolesTableFull } from "../components/RolesTableFull";
import { RoleCreateDialog } from "../components/RoleCreateDialog";
import { RoleDetailDialog } from "../components/RoleDetailDialog";
import { RoleDeleteDialog } from "../components/RoleDeleteDialog";

const ROLE_STATUS_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
];

export function RolesPage() {
    const state = useRolesPage();
    const stats = [
        { title: "Total Roles", value: state.stats.total, icon: Shield, color: "text-primary" },
        { title: "Roles Activos", value: state.stats.active, icon: BadgeCheck, color: "text-success" },
        { title: "Usuarios Asignados", value: state.stats.assignedUsers, icon: Users, color: "text-secondary" },
    ];
    return (<DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Gestión de Roles" subtitle="Administra roles y permisos del sistema" action={<Button onClick={state.openCreate}>
              <Plus className="mr-2 h-4 w-4"/>
              Crear Rol
            </Button>}/>

        <StatsGrid stats={stats} columns={3}/>

        <SearchToolbar searchTerm={state.search.searchTerm} onSearchChange={state.search.setSearchTerm} searchPlaceholder="Buscar rol por nombre o descripción..." statusFilter={state.filters.activo === "all" ? "all" : state.filters.activo} onStatusFilterChange={(value) => state.setFilters({ ...state.filters, activo: value })} statusOptions={ROLE_STATUS_OPTIONS} hasActiveFilters={state.hasActiveFilters} onToggleFilters={state.dialogs.toggleFilters} onExport={state.handleExportCSV}/>

        {state.dialogs.isFilterOpen && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Filtros por Estado</div>
                <Button variant="ghost" size="sm" onClick={state.clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Actualmente mostrando: <strong>{state.pagination.totalItems} roles</strong>
                {" • "}Estado: <strong>{state.filters.activo === "all" ? "Todos" : state.filters.activo === "active" ? "Activos" : "Inactivos"}</strong>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <RolesTableFull items={state.items} onDetail={state.dialogs.openDetail} onEdit={state.openEdit} onDelete={state.dialogs.openDelete} onToggleStatus={state.handleToggleStatus} sortField={state.sortable.sortField} onSort={state.sortable.handleSort} getSortIcon={state.sortable.getSortIcon} totalItems={state.pagination.totalItems}/>
            <TablePagination currentPage={state.pagination.currentPage} totalPages={state.pagination.totalPages} totalItems={state.pagination.totalItems} onPageChange={state.pagination.goToPage} itemsLabel="roles"/>
          </CardContent>
        </Card>
      </div>

      <RoleCreateDialog open={state.dialogs.isCreateOpen} onOpenChange={state.dialogs.setIsCreateOpen} formData={state.formData} setFormData={state.setFormData} onTogglePermission={state.togglePermission} onSubmit={state.handleCreate}/>

      <RoleCreateDialog open={state.dialogs.isEditOpen} onOpenChange={state.dialogs.setIsEditOpen} formData={state.formData} setFormData={state.setFormData} onTogglePermission={state.togglePermission} onSubmit={state.handleEdit} isEdit/>

      <RoleDetailDialog
        open={state.dialogs.isDetailOpen}
        onOpenChange={state.dialogs.setIsDetailOpen}
        role={state.dialogs.selectedItem}
        onEdit={(role) => {
          state.dialogs.setIsDetailOpen(false);
          state.openEdit(role);
        }}
      />

      <RoleDeleteDialog open={state.dialogs.isDeleteOpen} onOpenChange={state.dialogs.setIsDeleteOpen} role={state.dialogs.selectedItem} onConfirm={state.handleDelete}/>
    </DashboardLayout>);
}
