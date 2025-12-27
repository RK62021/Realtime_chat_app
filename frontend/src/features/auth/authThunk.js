import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  forgotPassword,
  usernameSetup,
  logoutwork
} from "../../services/auth";

// ---------------- LOGIN ----------------
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await login(credentials);
      const { accessToken, user, needSetup } = res.data.data;
      return { token: accessToken, user, needSetup };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

// ---------------- REGISTER ----------------
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await register(payload); // use your service
      const { accessToken, user, needSetup } = res.data.data;
      return { token: accessToken, user, needSetup };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      return rejectWithValue(message);
    }
  }
);

// ---------------- FORGOT PASSWORD ----------------
export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await forgotPassword(data);
      return res.data.message; // backend sends message
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Password reset failed";
      return rejectWithValue(message);
    }
  }
);

// ---------------- USERNAME SETUP ----------------
export const usernameSetupThunk = createAsyncThunk(
  "auth/usernameSetup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await usernameSetup(data);
      const { username } = res.data.data.user; // or just res.data.data.username
      return { username };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Username setup failed";
      return rejectWithValue(message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutwork(); // backend clears cookie
      return true; // important
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Logout failed";
      return rejectWithValue(message);
    }
  }
);
