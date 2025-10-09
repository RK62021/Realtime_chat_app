import { Api_ENDPOINTS } from "../config/api";
import api from "../utils/axios";

// Login
export const login = (credentials) => {
  return api.post(Api_ENDPOINTS.Auth.LOGIN, credentials);
};
// Register
export const register = (data) => {
  return api.post(Api_ENDPOINTS.Auth.REGISTER, data);
};

// Forgot Password
export const forgotPassword = (data) => {
  return api.post(Api_ENDPOINTS.Auth.FORGOT_PASSWORD, data);
};

// Username Setup
export const usernameSetup = (data) => {
  return api.post(Api_ENDPOINTS.User.USERNAME_SETUP, data);
};
