import { useMemo, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge, roleActivoMap, userStatusMap } from "@/features/admin/components/StatusBadge";
import { BadgeCheck, CalendarDays, Check, LayoutGrid, Lock, Pencil, Search, Shield, Users, X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ACTION_COLUMNS, MODULE_LABELS, MODULE_ORDER, PERMISSIONS_MATRIX } from "./RolesList";
import { ALL_PERMISSIONS } from "../userServices";

function formatRoleDate(dateValue) {
    if (!dateValue)
        return "Sin fecha registrada";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime()))
        return String(dateValue);
    return new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(parsed);
}

function getAccessCoverageLabel(coverage) {
    if (coverage >= 1)
        return "Control total";
    if (coverage >= 0.65)
        return "Cobertura alta";
    if (coverage > 0)
        return "Cobertura parcial";
    return "Sin privilegios";
}

function getAccessLevelValue(role, coverage) {
    const explicitLevel = role?.nivel_acceso ?? role?.accessLevel ?? role?.nivel;
    if (explicitLevel)
        return explicitLevel;
    const coverageLabel = getAccessCoverageLabel(coverage);
    return role?.nombre ? `${role.nombre} / ${coverageLabel}` : coverageLabel;
}

export function RoleDetailDialog({ open, onOpenChange, role, onEdit }) {
    const [searchTerm, setSearchTerm] = useState("");
    if (!role)
        return null;
    const selectedPermissionIds = (role.permisosIds ?? role.permisos_ids ?? []).map((id) => Number(id));
    const permissionsByModule = useMemo(() => {
        return PERMISSIONS_MATRIX.map((row) => {
            const actions = ACTION_COLUMNS.map((column) => {
                const permissionId = row.actions[column.key];
                const permission = ALL_PERMISSIONS.find((item) => item.id === Number(permissionId));
                const isActive = permissionId != null && selectedPermissionIds.includes(Number(permissionId));
                return {
                    key: column.key,
                    label: permission?.label ?? `${column.label} ${row.moduleLabel}`,
                    isApplicable: permissionId != null,
                    isActive,
                    permissionId,
                };
            }).filter((action) => action.isApplicable);
            return {
                moduleKey: row.moduleKey,
                moduleLabel: row.moduleLabel,
                activeCount: actions.filter((action) => action.isActive).length,
                totalCount: actions.length,
                actions,
            };
        });
    }, [selectedPermissionIds]);
    const filteredModules = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term)
            return permissionsByModule;
        return permissionsByModule
            .map((module) => {
            const moduleMatches = module.moduleLabel.toLowerCase().includes(term);
            const filteredActions = moduleMatches
                ? module.actions
                : module.actions.filter((action) => action.label.toLowerCase().includes(term));
            if (!moduleMatches && filteredActions.length === 0)
                return null;
            return {
                ...module,
                visibleActions: filteredActions,
            };
        })
            .filter(Boolean);
    }, [permissionsByModule, searchTerm]);
    const totalAvailablePermissions = ALL_PERMISSIONS.length;
    const totalAvailableModules = MODULE_ORDER.filter((moduleKey) => MODULE_LABELS[moduleKey]).length;
    const activeModules = permissionsByModule.filter((module) => module.activeCount > 0).length;
    const coverage = totalAvailablePermissions > 0 ? selectedPermissionIds.length / totalAvailablePermissions : 0;
    const accessCoverageLabel = getAccessCoverageLabel(coverage);
    const accessLevelValue = getAccessLevelValue(role, coverage);
    const assignedUsers = role.usuarios_asignados ?? role.usersCount ?? 0;
    return (<Dialog open={open} onOpenChange={(nextOpen) => {
            if (!nextOpen)
                setSearchTerm("");
            onOpenChange(nextOpen);
        }}>
      <DialogContent className="sm:max-w-[880px] max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden">
        <div className="px-6 py-5 border-b bg-gradient-to-r from-primary/5 via-background to-background">
          <div className="flex items-start justify-between gap-4">
            <DialogHeader className="text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Shield className="h-6 w-6"/>
                </div>
                <div className="space-y-1">
                  <DialogTitle className="text-2xl">Detalle del Rol de Usuario</DialogTitle>
                  <DialogDescription className="text-sm">
                    Visualiza el alcance operativo y los permisos autorizados para este rol.
                  </DialogDescription>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                  <CalendarDays className="h-4 w-4"/>
                  Creado el: {formatRoleDate(role.creado_en ?? role.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                  <Users className="h-4 w-4"/>
                  {assignedUsers} usuario(s) asignado(s)
                </span>
              </div>
            </DialogHeader>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="shrink-0 rounded-full border">
                <X className="h-4 w-4"/>
                <span className="sr-only">Cerrar</span>
              </Button>
            </DialogClose>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{role.nombre}</CardTitle>
                  <CardDescription>{role.descripcion || "Este rol no tiene una descripción registrada."}</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {typeof role.activo === "boolean" ? (<StatusBadge status={role.activo} map={roleActivoMap}/>) : (<StatusBadge status={role.status} map={userStatusMap}/>)}
                  <Badge variant="secondary">{accessCoverageLabel}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-border/70 shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <BadgeCheck className="h-5 w-5"/>
                  </div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">PERMISOS ACTIVOS</p>
                </div>
                <div className="text-2xl font-bold">{selectedPermissionIds.length} de {totalAvailablePermissions} acciones</div>
                <p className="mt-1 text-sm text-muted-foreground">calculado con los permisos reales asignados al rol</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <LayoutGrid className="h-5 w-5"/>
                  </div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">MÓDULOS ASIGNADOS</p>
                </div>
                <div className="text-2xl font-bold">{activeModules} de {totalAvailableModules} módulos</div>
                <p className="mt-1 text-sm text-muted-foreground">módulos con al menos una acción autorizada</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Lock className="h-5 w-5"/>
                  </div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">NIVEL DE ACCESO</p>
                </div>
                <div className="text-xl font-bold leading-tight">{accessLevelValue}</div>
                <p className="mt-1 text-sm text-muted-foreground">{Math.round(coverage * 100)}% de cobertura sobre los permisos disponibles</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/70 shadow-sm">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-lg">PRIVILEGIOS Y PERMISOS POR MÓDULO</CardTitle>
                <CardDescription>
                  Capacidades operativas autorizadas para los usuarios con este rol.
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Filtrar permisos..."
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredModules.length === 0 ? (<div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                  No se encontraron módulos o permisos para "{searchTerm}".
                </div>) : (filteredModules.map((module) => (<div key={module.moduleKey} className="rounded-2xl border bg-muted/10 p-4 shadow-sm">
                    <div className="flex flex-col gap-2 border-b pb-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="font-semibold text-base">{module.moduleLabel}</h4>
                        <p className="text-sm text-muted-foreground">
                          {module.activeCount} acciones autorizadas
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {module.activeCount}/{module.totalCount}
                        </Badge>
                        {module.activeCount === module.totalCount ? (<Badge>Acceso completo</Badge>) : (<Badge variant="outline">Acceso parcial</Badge>)}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {(module.visibleActions ?? module.actions).map((action) => (<div
                            key={action.permissionId}
                            className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors ${action.isActive
                                ? "border-primary/20 bg-primary/5 text-foreground"
                                : "border-border/70 bg-background text-muted-foreground"}`}
                          >
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-full border ${action.isActive
                                  ? "border-primary/20 bg-primary text-primary-foreground"
                                  : "border-border bg-muted text-muted-foreground"}`}
                            >
                              {action.isActive ? <Check className="h-4 w-4"/> : <span className="h-2 w-2 rounded-full bg-current opacity-60"/>}
                            </span>
                            <span className={action.isActive ? "font-medium" : ""}>{action.label}</span>
                          </div>))}
                    </div>
                  </div>)))}
            </CardContent>
          </Card>
        </div>

        <div className="px-6 py-4 border-t bg-background">
          <DialogFooter className="justify-between sm:justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
            <Button type="button" onClick={() => onEdit?.(role)}>
              <Pencil className="mr-2 h-4 w-4"/>
              Editar Rol
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>);
}
