import { Api_ENDPOINTS } from "../config/api";
import api from "../utils/axios";

// LOGIN (no auth, no refresh)
export const login = (credentials) => {
  return api.post(
    Api_ENDPOINTS.Auth.LOGIN,
    credentials,
    { skipAuth: true }
  );
};

// REGISTER (no auth, no refresh)
export const register = (data) => {
  return api.post(
    Api_ENDPOINTS.Auth.REGISTER,
    data,
    { skipAuth: true }
  );
};

// FORGOT PASSWORD (no auth, no refresh)
export const forgotPassword = (data) => {
  return api.post(
    Api_ENDPOINTS.Auth.FORGOT_PASSWORD,
    data,
    { skipAuth: true }
  );
};

// USERNAME SETUP (protected route → needs token)
export const usernameSetup = (data) => {
  return api.post(
    Api_ENDPOINTS.User.USERNAME_SETUP,
    data
  );
};

// LOGOUT (cookie-based, no refresh)
export const logoutwork = () => {
  return api.post(
    Api_ENDPOINTS.Auth.LOGOUT,
    {},
    { skipAuth: true }
  );
};
