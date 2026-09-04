import { Shield, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ALL_PERMISSIONS, userServices } from "../userServices";

export const MODULE_LABELS = {
    users: "Usuarios",
    roles: "Roles",
    tours: "Tours",
    bookings: "Reservas",
    clients: "Clientes",
    sales: "Ventas",
    reports: "Reportes",
};
export const MODULE_ORDER = ["users", "roles", "tours", "bookings", "clients", "sales", "reports"];
export const ACTION_COLUMNS = [
    { key: "view", label: "Ver" },
    { key: "create", label: "Crear" },
    { key: "edit", label: "Editar" },
    { key: "delete", label: "Eliminar" },
    { key: "export", label: "Exportar" },
];

export function buildPermissionsMatrix() {
    const matrix = {};
    MODULE_ORDER.forEach((mod) => {
        matrix[mod] = { view: null, create: null, edit: null, delete: null, export: null };
    });
    ALL_PERMISSIONS.forEach((perm) => {
        const [mod, action] = perm.key.split(".");
        if (matrix[mod] && Object.prototype.hasOwnProperty.call(matrix[mod], action)) {
            matrix[mod][action] = perm.id;
        }
    });
    return MODULE_ORDER.map((mod) => ({
        moduleKey: mod,
        moduleLabel: MODULE_LABELS[mod] ?? mod,
        actions: matrix[mod],
    }));
}
export const PERMISSIONS_MATRIX = buildPermissionsMatrix();

export function RolesList({ roles }) {
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {roles.map((role) => (<Card key={role.id} className="border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary"/>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4"/>
                {role.usuarios_asignados ?? role.usersCount} usuarios
              </div>
            </div>
            <CardTitle className="mt-2">{role.nombre}</CardTitle>
            <CardDescription>{role.descripcion}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {userServices.getPermissionKeysByIds(role.permisosIds ?? role.permisos_ids ?? []).slice(0, 6).map((perm) => (<span key={perm} className="px-2 py-1 bg-muted text-xs rounded-full">
                  {perm}
                </span>))}
              {(role.permisosIds ?? role.permisos_ids ?? []).length > 6 && (<span className="px-2 py-1 bg-muted text-xs rounded-full">
                  +{(role.permisosIds ?? role.permisos_ids ?? []).length - 6} más
                </span>)}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Editar
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>))}
    </div>);
}

export function PermissionsTable({ selected, onToggle, disabled = false }) {
    const selectedIds = (selected || []).map((id) => Number(id));
    return (<div className="py-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%] min-w-[140px]">Módulo</TableHead>
            {ACTION_COLUMNS.map((col) => (
              <TableHead key={col.key} className="w-[14%] min-w-[72px] text-center">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSIONS_MATRIX.map((row) => (
            <TableRow key={row.moduleKey}>
              <TableCell className="font-medium">{row.moduleLabel}</TableCell>
              {ACTION_COLUMNS.map((col) => {
                const permId = row.actions[col.key];
                const isApplicable = permId !== null;
                const isChecked = isApplicable && selectedIds.includes(permId);
                return (
                  <TableCell key={col.key} className="text-center">
                    {isApplicable ? (
                      <Checkbox
                        disabled={disabled}
                        checked={isChecked}
                        onCheckedChange={() => {
                          if (!disabled && typeof onToggle === "function") {
                            onToggle(permId);
                          }
                        }}
                        className="mx-auto"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>);
}
