import { supabase, isSupabaseConfigured, withMockDelay } from "@/shared/lib/supabase.js";
import { api, isApiConfigured } from "@/shared/lib/api";

export const USER_ROLE_OPTIONS = [
    { value: "1", label: "Administrador" },
    { value: "2", label: "Guía" },
    { value: "3", label: "Turista" },
];

export const USER_STATUS_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "ACTIVO", label: "Activos" },
    { value: "INACTIVO", label: "Inactivos" },
    { value: "BLOQUEADO", label: "Bloqueados" },
];

export const ALL_PERMISSIONS = [
    { id: 1, key: "users.view", label: "Ver Usuarios" },
    { id: 2, key: "users.create", label: "Crear Usuarios" },
    { id: 3, key: "users.edit", label: "Editar Usuarios" },
    { id: 4, key: "users.delete", label: "Eliminar Usuarios" },
    { id: 5, key: "roles.view", label: "Ver Roles" },
    { id: 6, key: "roles.create", label: "Crear Roles" },
    { id: 7, key: "roles.edit", label: "Editar Roles" },
    { id: 8, key: "roles.delete", label: "Eliminar Roles" },
    { id: 9, key: "tours.view", label: "Ver Tours" },
    { id: 10, key: "tours.create", label: "Crear Tours" },
    { id: 11, key: "tours.edit", label: "Editar Tours" },
    { id: 12, key: "tours.delete", label: "Eliminar Tours" },
    { id: 13, key: "bookings.view", label: "Ver Reservas" },
    { id: 14, key: "bookings.create", label: "Crear Reservas" },
    { id: 15, key: "bookings.edit", label: "Editar Reservas" },
    { id: 16, key: "bookings.delete", label: "Eliminar Reservas" },
    { id: 17, key: "clients.view", label: "Ver Clientes" },
    { id: 18, key: "clients.create", label: "Crear Clientes" },
    { id: 19, key: "clients.edit", label: "Editar Clientes" },
    { id: 20, key: "clients.delete", label: "Eliminar Clientes" },
    { id: 21, key: "sales.view", label: "Ver Ventas" },
    { id: 22, key: "sales.create", label: "Crear Ventas" },
    { id: 23, key: "sales.edit", label: "Editar Ventas" },
    { id: 24, key: "sales.delete", label: "Eliminar Ventas" },
    { id: 25, key: "reports.view", label: "Ver Reportes" },
    { id: 26, key: "reports.export", label: "Exportar Reportes" },
];

const ROLE_NAMES_BY_ID = {
    1: "Administrador",
    2: "Guía",
    3: "Turista",
};

export const mockUsers = [
    { id: 1, nombre: "Juan", apellido: "Pérez", correo: "juan@ejemplo.com", telefono: "+57 300 123 4567", rolIds: [1], estado: "ACTIVO", creado_en: "2024-01-15", ultimo_login: "2026-06-03 09:30", cargo: "Gerente General", departamento: "Administración", direccion: "Medellín, Colombia", roles: [{ id: 1, nombre: "Administrador" }] },
    { id: 2, nombre: "María", apellido: "González", correo: "maria@ejemplo.com", telefono: "+57 301 234 5678", rolIds: [2], estado: "ACTIVO", creado_en: "2024-02-20", ultimo_login: "2026-06-02 14:20", cargo: "Guía Senior", departamento: "Operaciones", direccion: "Medellín, Colombia", roles: [{ id: 2, nombre: "Guía" }] },
    { id: 3, nombre: "Carlos", apellido: "Rodríguez", correo: "carlos@ejemplo.com", telefono: "+57 302 345 6789", rolIds: [3], estado: "INACTIVO", creado_en: "2024-03-10", ultimo_login: "2026-05-28 10:15", cargo: "Turista", departamento: "Experiencias", direccion: "Medellín, Colombia", roles: [{ id: 3, nombre: "Turista" }] },
    { id: 4, nombre: "Ana", apellido: "Martínez", correo: "ana@ejemplo.com", telefono: "+57 303 456 7890", rolIds: [2], estado: "ACTIVO", creado_en: "2024-04-05", ultimo_login: "2026-06-03 08:45", cargo: "Guía", departamento: "Operaciones", direccion: "Medellín, Colombia", roles: [{ id: 2, nombre: "Guía" }] },
    { id: 5, nombre: "Luis", apellido: "Sánchez", correo: "luis@ejemplo.com", telefono: "+57 304 567 8901", rolIds: [1], estado: "ACTIVO", creado_en: "2024-05-12", ultimo_login: "2026-06-03 11:00", cargo: "Administrador de Sistemas", departamento: "Administración", direccion: "Medellín, Colombia", roles: [{ id: 1, nombre: "Administrador" }] },
    { id: 6, nombre: "Patricia", apellido: "López", correo: "patricia@ejemplo.com", telefono: "+57 305 678 9012", rolIds: [3], estado: "ACTIVO", creado_en: "2024-06-18", ultimo_login: "2026-06-02 16:30", cargo: "Turista", departamento: "Experiencias", direccion: "Medellín, Colombia", roles: [{ id: 3, nombre: "Turista" }] },
    { id: 7, nombre: "Roberto", apellido: "Díaz", correo: "roberto@ejemplo.com", telefono: "+57 306 789 0123", rolIds: [2, 3], estado: "ACTIVO", creado_en: "2024-07-22", ultimo_login: "2026-06-01 12:00", cargo: "Guía / Turista", departamento: "Operaciones", direccion: "Medellín, Colombia", roles: [{ id: 2, nombre: "Guía" }, { id: 3, nombre: "Turista" }] },
    { id: 8, nombre: "Sandra", apellido: "Torres", correo: "sandra@ejemplo.com", telefono: "+57 307 890 1234", rolIds: [3], estado: "BLOQUEADO", creado_en: "2024-08-30", ultimo_login: "2026-05-20 09:00", cargo: "Turista", departamento: "Experiencias", direccion: "Medellín, Colombia", roles: [{ id: 3, nombre: "Turista" }] },
];

export const mockRoles = [
    {
        id: 1,
        nombre: "Administrador",
        descripcion: "Acceso total al sistema",
        activo: true,
        permisosIds: ALL_PERMISSIONS.map((p) => p.id),
        usuarios_asignados: 2,
        creado_en: "2024-01-10",
    },
    {
        id: 2,
        nombre: "Guía",
        descripcion: "Gestión de tours y grupos asignados",
        activo: true,
        permisosIds: [9, 13, 17],
        usuarios_asignados: 5,
        creado_en: "2024-02-15",
    },
    {
        id: 3,
        nombre: "Turista",
        descripcion: "Consulta y reserva de experiencias",
        activo: true,
        permisosIds: [13, 14, 15, 17, 18],
        usuarios_asignados: 3,
        creado_en: "2024-03-20",
    },
];

export const emptyUserForm = {
    firstName: "",
    lastName: "",
    correo: "",
    telefono: "",
    rolId: "",
    estado: "ACTIVO",
    cargo: "",
    departamento: "",
    direccion: "",
    password: "",
};

export const emptyRoleForm = {
    nombre: "",
    descripcion: "",
    activo: true,
    permisosIds: [],
};

function mapUserRoles(roles) {
    if (!roles || !Array.isArray(roles)) return [];
    return roles.map((r) => ({
        id: r.id ?? r.rol_id,
        nombre: r.nombre ?? ROLE_NAMES_BY_ID[r.id ?? r.rol_id] ?? "Rol",
    }));
}

function normalizeUserFromDb(u) {
    return {
        id: u.id,
        nombre: u.nombre ?? u.firstName ?? "",
        apellido: u.apellido ?? u.lastName ?? "",
        correo: u.correo ?? u.email ?? "",
        telefono: u.telefono ?? u.phone ?? "",
        rolIds: u.rol_ids ?? u.rolIds ?? [],
        estado: u.estado ?? u.status ?? "ACTIVO",
        cargo: u.cargo ?? "",
        departamento: u.departamento ?? "",
        direccion: u.direccion ?? u.address ?? "",
        creado_en: u.creado_en ?? u.createdAt ?? new Date().toISOString().split("T")[0],
        ultimo_login: u.ultimo_login ?? u.lastLogin ?? null,
        roles: mapUserRoles(u.roles ?? u.roles_data ?? []),
    };
}

function normalizeRoleFromDb(r) {
    return {
        id: r.id,
        nombre: r.nombre ?? "",
        descripcion: r.descripcion ?? "",
        activo: typeof r.activo === "boolean" ? r.activo : r.status === "active" ? true : false,
        permisosIds: r.permisos_ids ?? r.permisosIds ?? [],
        usuarios_asignados: r.usuarios_asignados ?? r.usersCount ?? 0,
        creado_en: r.creado_en ?? r.createdAt ?? new Date().toISOString().split("T")[0],
    };
}

function getPermissionKeysByIds(ids) {
    if (!ids || !Array.isArray(ids)) return [];
    return ids
        .map((id) => ALL_PERMISSIONS.find((p) => p.id === Number(id))?.key)
        .filter(Boolean);
}

export const userServices = {
    getInitials(nombre, apellido = "") {
        const n = String(nombre || "").trim();
        const a = String(apellido || "").trim();
        const full = [n, a].filter(Boolean).join(" ");
        if (!full) return "--";
        return full
            .split(" ")
            .map((w) => w[0])
            .filter(Boolean)
            .join("")
            .toUpperCase()
            .slice(0, 2);
    },

    getFullName(user) {
        if (!user) return "";
        if (user.name) return user.name;
        return [user.nombre, user.apellido].filter(Boolean).join(" ").trim() || user.correo || "";
    },

    getRolesLabel(user) {
        if (!user) return "";
        if (user.role) return user.role;
        if (user.roles && Array.isArray(user.roles)) {
            return user.roles.map((r) => r.nombre).join(", ");
        }
        if (user.rolIds && Array.isArray(user.rolIds)) {
            return user.rolIds.map((id) => ROLE_NAMES_BY_ID[Number(id)] || "Rol").join(", ");
        }
        return "";
    },

    computeStats(users, filteredCount) {
        return {
            total: users.length,
            active: users.filter((u) => (u.estado ?? u.status) === "ACTIVO" || (u.estado ?? u.status) === "active").length,
            inactive: users.filter((u) => (u.estado ?? u.status) === "INACTIVO" || (u.estado ?? u.status) === "inactive").length,
            blocked: users.filter((u) => (u.estado ?? u.status) === "BLOQUEADO").length,
            filtered: filteredCount,
        };
    },

    roleStats(roles) {
        return {
            total: roles.length,
            active: roles.filter((r) => (r.activo === true) || r.status === "active").length,
            assignedUsers: roles.reduce((sum, r) => sum + (r.usuarios_asignados ?? r.usersCount ?? 0), 0),
        };
    },

    exportCSV(users) {
        const headers = ["ID", "Nombre", "Apellido", "Email", "Teléfono", "Roles", "Estado", "Departamento", "Fecha Creación"];
        const csv = [
            headers.join(","),
            ...users.map((user) => [
                user.id,
                user.nombre ?? user.firstName ?? "",
                user.apellido ?? user.lastName ?? "",
                user.correo ?? user.email ?? "",
                user.telefono ?? user.phone ?? "",
                userServices.getRolesLabel(user),
                user.estado ?? user.status ?? "",
                user.departamento ?? user.department ?? "",
                user.creado_en ?? user.createdAt ?? "",
            ].join(",")),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `usuarios-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    },

    async getUsers() {
        if (isApiConfigured) {
            const data = await api.get("/users");
            return data.map((user) => normalizeUserFromDb({
                ...user,
                id: user.id_usuario,
                creado_en: user.fecha_creacion,
                ultimo_login: user.ultimo_acceso,
                roles: (user.roles || []).map((nombre, index) => ({ id: index + 1, nombre })),
            }));
        }
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase
                .from("usuarios")
                .select(`
                    id,
                    nombre,
                    apellido,
                    correo,
                    telefono,
                    estado,
                    cargo,
                    departamento,
                    direccion,
                    creado_en,
                    ultimo_login,
                    usuario_roles (
                        rol:roles(id, nombre)
                    )
                `)
                .order("creado_en", { ascending: false });
            if (error) throw error;
            return (data || []).map((u) => {
                const rolesMapped = (u.usuario_roles || []).map((ur) => ur.rol).filter(Boolean);
                return normalizeUserFromDb({
                    ...u,
                    rol_ids: rolesMapped.map((r) => r.id),
                    roles: rolesMapped,
                });
            });
        }
        return withMockDelay(mockUsers.map(normalizeUserFromDb), 500);
    },

    async createUser(payload) {
        const { rol_ids, password, ...userData } = payload;
        const cleanUserData = {
            nombre: userData.nombre,
            apellido: userData.apellido,
            correo: userData.correo,
            telefono: userData.telefono || null,
            estado: userData.estado || "ACTIVO",
            cargo: userData.cargo || null,
            departamento: userData.departamento || null,
            direccion: userData.direccion || null,
            contrasena_hash: password || "mock_hash_temporal",
        };
        if (isSupabaseConfigured && supabase) {
            const { data: userResult, error: userError } = await supabase
                .from("usuarios")
                .insert(cleanUserData)
                .select()
                .single();
            if (userError) throw userError;
            if (rol_ids && rol_ids.length > 0) {
                const userRoles = rol_ids.map((rolId) => ({
                    usuario_id: userResult.id,
                    rol_id: Number(rolId),
                }));
                const { error: rolesError } = await supabase
                    .from("usuario_roles")
                    .insert(userRoles);
                if (rolesError) throw rolesError;
            }
            return normalizeUserFromDb({
                ...userResult,
                rol_ids,
                roles: rol_ids.map((id) => ({ id, nombre: ROLE_NAMES_BY_ID[id] || "Rol" })),
            });
        }
        await new Promise((r) => setTimeout(r, 400));
        const newId = Math.max(...mockUsers.map((u) => u.id), 0) + 1;
        const newUser = normalizeUserFromDb({
            id: newId,
            ...cleanUserData,
            creado_en: new Date().toISOString().split("T")[0],
            ultimo_login: null,
            rol_ids,
            roles: rol_ids.map((id) => ({ id, nombre: ROLE_NAMES_BY_ID[id] || "Rol" })),
        });
        mockUsers.push(newUser);
        return newUser;
    },

    async updateUser(userId, payload) {
        const { rol_ids, password, ...userData } = payload;
        const cleanUserData = {
            nombre: userData.nombre,
            apellido: userData.apellido,
            correo: userData.correo,
            telefono: userData.telefono || null,
            estado: userData.estado || "ACTIVO",
            cargo: userData.cargo || null,
            departamento: userData.departamento || null,
            direccion: userData.direccion || null,
        };
        if (password) {
            cleanUserData.contrasena_hash = password;
        }
        if (isSupabaseConfigured && supabase) {
            const { data: userResult, error: userError } = await supabase
                .from("usuarios")
                .update(cleanUserData)
                .eq("id", userId)
                .select()
                .single();
            if (userError) throw userError;
            if (rol_ids) {
                const { error: delError } = await supabase
                    .from("usuario_roles")
                    .delete()
                    .eq("usuario_id", userId);
                if (delError) throw delError;
                if (rol_ids.length > 0) {
                    const userRoles = rol_ids.map((rolId) => ({
                        usuario_id: userId,
                        rol_id: Number(rolId),
                    }));
                    const { error: insError } = await supabase
                        .from("usuario_roles")
                        .insert(userRoles);
                    if (insError) throw insError;
                }
            }
            return normalizeUserFromDb({
                ...userResult,
                rol_ids: rol_ids || [],
                roles: (rol_ids || []).map((id) => ({ id, nombre: ROLE_NAMES_BY_ID[id] || "Rol" })),
            });
        }
        await new Promise((r) => setTimeout(r, 300));
        const idx = mockUsers.findIndex((u) => u.id === userId);
        if (idx < 0) throw new Error("Usuario no encontrado");
        const updated = normalizeUserFromDb({
            ...mockUsers[idx],
            ...cleanUserData,
            rol_ids: rol_ids ?? mockUsers[idx].rolIds,
            roles: (rol_ids ?? mockUsers[idx].rolIds).map((id) => ({ id, nombre: ROLE_NAMES_BY_ID[id] || "Rol" })),
        });
        mockUsers[idx] = updated;
        return updated;
    },

    async deleteUser(userId) {
        if (isSupabaseConfigured && supabase) {
            const { error: rolesError } = await supabase
                .from("usuario_roles")
                .delete()
                .eq("usuario_id", userId);
            if (rolesError) throw rolesError;
            const { error } = await supabase
                .from("usuarios")
                .delete()
                .eq("id", userId);
            if (error) throw error;
            return true;
        }
        await new Promise((r) => setTimeout(r, 300));
        const idx = mockUsers.findIndex((u) => u.id === userId);
        if (idx < 0) throw new Error("Usuario no encontrado");
        mockUsers.splice(idx, 1);
        return true;
    },

    async toggleUserStatus(userId) {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase
                .from("usuarios")
                .select("estado")
                .eq("id", userId)
                .single();
            if (error) throw error;
            const nextEstado = data.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
            const { error: updError } = await supabase
                .from("usuarios")
                .update({ estado: nextEstado })
                .eq("id", userId);
            if (updError) throw updError;
            return nextEstado;
        }
        await new Promise((r) => setTimeout(r, 200));
        const user = mockUsers.find((u) => u.id === userId);
        if (!user) throw new Error("Usuario no encontrado");
        const current = user.estado ?? user.status ?? "ACTIVO";
        const next = current === "ACTIVO" || current === "active" ? "INACTIVO" : "ACTIVO";
        user.estado = next;
        if (user.status) delete user.status;
        return next;
    },

    async getRoles() {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase
                .from("roles")
                .select(`
                    id,
                    nombre,
                    descripcion,
                    activo,
                    creado_en,
                    rol_permisos (
                        permiso_id
                    ),
                    usuarios_asignados:usuario_roles(count)
                `)
                .order("nombre", { ascending: true });
            if (error) throw error;
            return (data || []).map((r) => normalizeRoleFromDb({
                ...r,
                permisos_ids: (r.rol_permisos || []).map((rp) => rp.permiso_id),
                usuarios_asignados: (r.usuarios_asignados && r.usuarios_asignados[0]?.count) || 0,
            }));
        }
        return withMockDelay(mockRoles.map(normalizeRoleFromDb), 500);
    },

    async createRole(payload) {
        const { permisos_ids, ...roleData } = payload;
        const cleanRoleData = {
            nombre: roleData.nombre,
            descripcion: roleData.descripcion || null,
            activo: roleData.activo !== false,
        };
        if (isSupabaseConfigured && supabase) {
            const { data: roleResult, error: roleError } = await supabase
                .from("roles")
                .insert(cleanRoleData)
                .select()
                .single();
            if (roleError) throw roleError;
            if (permisos_ids && permisos_ids.length > 0) {
                const rolePerms = permisos_ids.map((permId) => ({
                    rol_id: roleResult.id,
                    permiso_id: Number(permId),
                }));
                const { error: permsError } = await supabase
                    .from("rol_permisos")
                    .insert(rolePerms);
                if (permsError) throw permsError;
            }
            return normalizeRoleFromDb({
                ...roleResult,
                permisos_ids,
                usuarios_asignados: 0,
            });
        }
        await new Promise((r) => setTimeout(r, 400));
        const newId = Math.max(...mockRoles.map((r) => r.id), 0) + 1;
        const newRole = normalizeRoleFromDb({
            id: newId,
            ...cleanRoleData,
            creado_en: new Date().toISOString().split("T")[0],
            permisos_ids,
            usuarios_asignados: 0,
        });
        mockRoles.push(newRole);
        return newRole;
    },

    async updateRole(roleId, payload) {
        const { permisos_ids, ...roleData } = payload;
        const cleanRoleData = {
            nombre: roleData.nombre,
            descripcion: roleData.descripcion ?? null,
            activo: roleData.activo,
        };
        if (isSupabaseConfigured && supabase) {
            const { data: roleResult, error: roleError } = await supabase
                .from("roles")
                .update(cleanRoleData)
                .eq("id", roleId)
                .select()
                .single();
            if (roleError) throw roleError;
            if (permisos_ids) {
                const { error: delError } = await supabase
                    .from("rol_permisos")
                    .delete()
                    .eq("rol_id", roleId);
                if (delError) throw delError;
                if (permisos_ids.length > 0) {
                    const rolePerms = permisos_ids.map((permId) => ({
                        rol_id: roleId,
                        permiso_id: Number(permId),
                    }));
                    const { error: insError } = await supabase
                        .from("rol_permisos")
                        .insert(rolePerms);
                    if (insError) throw insError;
                }
            }
            const { count, error: cntError } = await supabase
                .from("usuario_roles")
                .select("*", { count: "exact", head: true })
                .eq("rol_id", roleId);
            if (cntError) throw cntError;
            return normalizeRoleFromDb({
                ...roleResult,
                permisos_ids,
                usuarios_asignados: count || 0,
            });
        }
        await new Promise((r) => setTimeout(r, 300));
        const idx = mockRoles.findIndex((r) => r.id === roleId);
        if (idx < 0) throw new Error("Rol no encontrado");
        const updated = normalizeRoleFromDb({
            ...mockRoles[idx],
            ...cleanRoleData,
            permisos_ids: permisos_ids ?? mockRoles[idx].permisosIds,
        });
        mockRoles[idx] = updated;
        return updated;
    },

    async deleteRole(roleId) {
        if (isSupabaseConfigured && supabase) {
            const { error: permsError } = await supabase
                .from("rol_permisos")
                .delete()
                .eq("rol_id", roleId);
            if (permsError) throw permsError;
            const { error: usersError } = await supabase
                .from("usuario_roles")
                .delete()
                .eq("rol_id", roleId);
            if (usersError) throw usersError;
            const { error } = await supabase
                .from("roles")
                .delete()
                .eq("id", roleId);
            if (error) throw error;
            return true;
        }
        await new Promise((r) => setTimeout(r, 300));
        const idx = mockRoles.findIndex((r) => r.id === roleId);
        if (idx < 0) throw new Error("Rol no encontrado");
        mockRoles.splice(idx, 1);
        return true;
    },

    async toggleRoleActivo(roleId) {
        if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase
                .from("roles")
                .select("activo")
                .eq("id", roleId)
                .single();
            if (error) throw error;
            const nextActivo = !data.activo;
            const { error: updError } = await supabase
                .from("roles")
                .update({ activo: nextActivo })
                .eq("id", roleId);
            if (updError) throw updError;
            return nextActivo;
        }
        await new Promise((r) => setTimeout(r, 200));
        const role = mockRoles.find((r) => r.id === roleId);
        if (!role) throw new Error("Rol no encontrado");
        const next = !(role.activo ?? role.status === "active");
        role.activo = next;
        if (role.status) delete role.status;
        return next;
    },

    getPermissionKeysByIds,
};
