import axios from "axios";
import { API_URL } from "../config/index.js";
import store from "../store/store.js";
import { loginSuccess, logout } from "../features/auth/authSlice.js";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 send cookies (refresh token)
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    // 👇 If skipAuth is true, do NOT attach access token
    if (config.skipAuth) return config;

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚫 If explicitly skipped, don't refresh
    if (originalRequest?.skipAuth) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, user, needSetup } = res.data;

        store.dispatch(
          loginSuccess({
            token: accessToken,
            user,
            needSetup,
          })
        );

        localStorage.setItem("token", accessToken);

        // Update Authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → force logout
        store.dispatch(logout());
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
