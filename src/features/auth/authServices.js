import { supabase, isSupabaseConfigured, withMockDelay } from "@/shared/lib/supabase.js";

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
  if (isSupabaseConfigured) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  }
  await withMockDelay(null, 300);
  return null;
}
