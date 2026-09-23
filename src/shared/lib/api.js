import { supabase } from "./supabase";

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
export const isApiConfigured = Boolean(import.meta.env.VITE_API_URL);

export async function apiRequest(path, options = {}) {
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  const accessToken = data.session?.access_token || window.localStorage.getItem("artetours_access_token");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || `Error HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => apiRequest(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => apiRequest(path, { method: "DELETE" }),
};

export function clearApiSession() {
  window.localStorage.removeItem("artetours_access_token");
  window.localStorage.removeItem("artetours_user");
}