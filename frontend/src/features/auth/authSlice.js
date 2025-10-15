import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from "jwt-decode";
import {
  loginThunk,
  registerThunk,
  forgotPasswordThunk,
  usernameSetupThunk,
} from "./authThunk.js";

const initialState = {
  isAuthenticated: false,
  token: null,
  user: {
    id: null,
    email: null,
    username: null,
    avatar: null,
    createdAt: null,
    updatedAt: null,
  },
  needSetup: false, // 👈 for username onboarding
  socketConnection: false, // 👈 Socket.IO connection state
  loading: false,
  error: null,
  rehydrated: false, // 👈 to track if state has been rehydrated
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Restore session if token exists in localStorage
    rehydrate: (state) => {
      const token = localStorage.getItem("token");
      // console.log("Rehydrating auth state with token:", token);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            state.isAuthenticated = true;
            state.token = token;
          } else {
            //  🚨 Token expired
            state.isAuthenticated = false;
            state.token = null;
            localStorage.removeItem("token");
          }
        } catch (error) {
          //  🚨 If decoding fails (invalid token), clear it
          state.isAuthenticated = false;
          state.token = null;
          localStorage.removeItem("token");
        }
      } else {
        state.isAuthenticated = false;
        state.token = null;
      }
      state.rehydrated = true;
    },

    // ✅ Manual login success (optional)
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.needSetup = action.payload.needSetup;

      localStorage.setItem("token", action.payload.token);
    },

    // ✅ Toggle onboarding state
    setNeedSetup: (state, action) => {
      state.needSetup = action.payload;
    },

    // ✅ Update socket connection state
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },

    // ✅ Logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = {
        id: null,
        email: null,
        username: null,
        avatar: null,
        createdAt: null,
        updatedAt: null,
      };
      state.needSetup = false;
      state.socketConnection = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
    },

    // ✅ Set rehydration status
    setRehydrated: (state, action) => {
      state.rehydrated = action.payload;
    }
  },

  extraReducers: (builder) => {
    // ------------------ LOGIN ------------------
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.needSetup = action.payload.needSetup || false;

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });

    // ------------------ REGISTER ------------------
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.needSetup = action.payload.needSetup || false;

        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

    // ------------------ USERNAME SETUP ------------------
    builder
      .addCase(usernameSetupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(usernameSetupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user.username = action.payload.username;
        state.needSetup = false;
      })
      .addCase(usernameSetupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Username setup failed";
      });

    // ------------------ FORGOT PASSWORD ------------------
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password reset failed";
      });
  },
});

export const {
  loginSuccess,
  logout,
  setNeedSetup,
  setSocketConnection,
  rehydrate,
  setRehydrated
} = authSlice.actions;

export default authSlice.reducer;
