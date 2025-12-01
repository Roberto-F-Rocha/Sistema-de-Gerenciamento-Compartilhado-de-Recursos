import axios from "axios";
import { logout } from "./auth";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 INTERCEPTOR DE REQUISIÇÃO — injeta o token em TODAS requisições
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 INTERCEPTOR DE RESPOSTA — tenta refresh quando der 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // só tenta refresh se for erro 401 e ainda não tentou
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        logout();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await api.post("users/token/refresh/", {
          refresh,
        });

        localStorage.setItem("access", refreshResponse.data.access);

        // injeta novo token
        originalRequest.headers.Authorization =
          `Bearer ${refreshResponse.data.access}`;

        // refaz a requisição original
        return api(originalRequest);
      } catch (e) {
        logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
