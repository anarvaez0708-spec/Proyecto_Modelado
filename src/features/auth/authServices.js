import { supabase, isSupabaseConfigured, withMockDelay } from "@/shared/lib/supabase.js";
import { api, isApiConfigured } from "@/shared/lib/api";

const SIMULATE_DELAY = 1500;

async function mockLogin({ correo, password, redirectTo = "/dashboard" }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      window.location.href = redirectTo;
      resolve();
    }, SIMULATE_DELAY);
  });
}

async function mockRegister(payload) {
  const snakePayload = {
    usuario: payload.usuario
      ? {
          nombre: payload.usuario.nombre,
          apellido: payload.usuario.apellido,
          correo: payload.usuario.correo,
          telefono: payload.usuario.telefono,
          password: payload.usuario.password,
          rol: payload.usuario.rol,
        }
      : null,
    turista: payload.turista
      ? {
          tipo_documento: payload.turista.tipo_documento,
          numero_documento: payload.turista.numero_documento,
          nacionalidad: payload.turista.nacionalidad,
          fecha_nacimiento: payload.turista.fecha_nacimiento,
          genero: payload.turista.genero,
        }
      : null,
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      window.location.href = "/login";
      resolve(snakePayload);
    }, SIMULATE_DELAY);
  });
}

export const authServices = {
  login: async ({ correo, password, redirectTo = "/dashboard" }) => {
    if (isApiConfigured) {
      const data = await api.post("/auth/login", { email: correo, password });
      const accessToken = data?.session?.access_token;
      if (accessToken) window.localStorage.setItem("artetours_access_token", accessToken);
      if (data?.user) window.localStorage.setItem("artetours_user", JSON.stringify(data.user));
      window.location.href = redirectTo;
      return data;
    }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: password,
      });
      if (error) throw error;
      window.location.href = redirectTo;
      return data;
    }
    return mockLogin({ correo, password, redirectTo });
  },

  register: async (payload) => {
    if (isApiConfigured) {
      const data = await api.post("/auth/register", {
        email: payload.usuario.correo,
        password: payload.usuario.password,
        profile: {
          nombre: payload.usuario.nombre,
          apellido: payload.usuario.apellido,
          telefono: payload.usuario.telefono,
          estado: "ACTIVO",
          rol: payload.usuario.rol,
          turista: payload.turista,
        },
      });
      window.location.href = "/login";
      return data;
    }
    if (isSupabaseConfigured) {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: payload.usuario.correo,
        password: payload.usuario.password,
        options: {
          data: {
            nombre: payload.usuario.nombre,
            apellido: payload.usuario.apellido,
            telefono: payload.usuario.telefono,
            rol: payload.usuario.rol,
          },
        },
      });
      if (signUpError) throw signUpError;

      const authUserId = authData?.user?.id;
      const usuarioPayload = {
        auth_id: authUserId,
        nombre: payload.usuario.nombre,
        apellido: payload.usuario.apellido,
        correo: payload.usuario.correo,
        telefono: payload.usuario.telefono,
        rol: payload.usuario.rol,
      };
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .insert(usuarioPayload)
        .select()
        .single();
      if (usuarioError) throw usuarioError;

      if (payload.turista && usuarioData?.id) {
        const turistaPayload = {
          usuario_id: usuarioData.id,
          tipo_documento: payload.turista.tipo_documento,
          numero_documento: payload.turista.numero_documento,
          nacionalidad: payload.turista.nacionalidad,
          fecha_nacimiento: payload.turista.fecha_nacimiento,
          genero: payload.turista.genero,
        };
        const { error: turistaError } = await supabase
          .from("turistas")
          .insert(turistaPayload);
        if (turistaError) throw turistaError;
      }

      window.location.href = "/login";
      return { usuarioData, authData };
    }
    return mockRegister(payload);
  },

  forgotPassword: async (_email) => {
    if (isApiConfigured) {
      return api.post("/auth/forgot-password", { email: _email });
    }
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(_email);
      if (error) throw error;
      return;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, SIMULATE_DELAY);
    });
  },

  validatePasswordStrength: (password) => {
    if (!password || password.length < 8) return false;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasUpper && hasLower && hasNumber;
  },

  validatePasswordsMatch: (password, confirmPassword) => {
    return Boolean(password && confirmPassword && password === confirmPassword);
  },
};

export async function currentUser() {
  if (isApiConfigured) {
    const token = window.localStorage.getItem("artetours_access_token");
    if (!token) return null;
    try {
      const user = await api.get("/auth/me");
      window.localStorage.setItem("artetours_user", JSON.stringify(user));
      return user;
    } catch {
      window.localStorage.removeItem("artetours_access_token");
      window.localStorage.removeItem("artetours_user");
      return null;
    }
  }
  if (isSupabaseConfigured) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  }
  await withMockDelay(null, 300);
  return null;
}
