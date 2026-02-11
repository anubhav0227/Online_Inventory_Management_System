import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5050/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    // ✅ Public endpoints (NO TOKEN)
    const isPublic =
      url.startsWith("/auth/login") ||
      url.startsWith("/auth/register");

    if (!isPublic) {
      const raw = localStorage.getItem("user");

      if (raw) {
        try {
          const user = JSON.parse(raw);

          if (user?.token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch {
          localStorage.removeItem("user");
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Ignore auth & preflight
    if (
      error.config?.method === "options" ||
      url.startsWith("/auth")
    ) {
      return Promise.reject(error);
    }

    // 🔒 Token invalid / expired
    if (status === 401 || status === 403) {
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
