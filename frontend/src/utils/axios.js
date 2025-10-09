import axios from "axios";
import { API_URL } from "../config/index.js";
import store from "../store/store.js";
import { loginSuccess, logout } from "../features/auth/authSlice.js";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ important to send cookies
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // access token from localStorage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → try refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true } // send refresh token cookie
        );

        store.dispatch(
          loginSuccess({
            token: res.data.accessToken,
            user: res.data.user,
            needSetup: res.data.needSetup,
          })
        ); // update Redux store

        localStorage.setItem("token", res.data.accessToken); // update localStorage
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`; // set new access token

        return api(originalRequest); // retry original request
      } catch (err) {
        store.dispatch(logout());
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
