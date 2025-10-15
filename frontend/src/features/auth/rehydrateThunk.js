import { jwtDecode } from "jwt-decode";
import { logout, loginSuccess, setRehydrated } from "./authSlice.js";
import { API_URL } from "../../config/index.js";
import axios from "axios";

/**
 * Thunk: Rehydrate session on app startup
 * 1️⃣ Validate access token in localStorage
 * 2️⃣ If valid → fetch /auth/me
 * 3️⃣ If expired → try refresh token (via cookie)
 * 4️⃣ If refresh success → fetch /auth/me with new access token
 * 5️⃣ If all fails → logout
 */
export const rehydrateThunk = () => async (dispatch) => {
  dispatch(setRehydrated(false));
  try {
    const token = localStorage.getItem("token");
    // console.log("Rehydrating with token:", token);

    // --- CASE 1: Token exists ---
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp > now) {
          // ✅ Valid token → fetch user
          const { data } = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          // console.log("Fetched user during rehydration:", data.data);

          dispatch(
            loginSuccess({
              token,
              user: data.data.user,
              needSetup: data.data.needSetup,
            })
          );
          dispatch(setRehydrated(true));
          return; // done
        } else {
          // ⛔ Token expired → remove it
          localStorage.removeItem("token");
        }
      } catch (err) {
        // ⛔ Invalid token format → clear and try refresh
        localStorage.removeItem("token");
      }
    }

    // --- CASE 2: Try refresh token ---
    try {
      const { data: refreshData } = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      if (refreshData.data.accessToken) {
        const newToken = refreshData.data.accessToken;
        localStorage.setItem("token", newToken);
        // console.log("New token after refresh:", localStorage.getItem("token"));

        // ✅ Fetch user with new token
        const { data: userData } = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${newToken}` },
          withCredentials: true,
        });
        // console.log("Fetched user after refresh:", userData);

        dispatch(
          loginSuccess({
            token: newToken,
            user: userData.data.user,
            needSetup: userData.data.needSetup,
          })
        );
        dispatch(setRehydrated(true));

        return;
      }
    } catch (refreshError) {
      console.warn("Refresh token invalid or expired.");
    }

    // --- CASE 3: Logout fallback ---
    dispatch(logout());
    dispatch(setRehydrated(true));
  } catch (error) {
    console.error("Rehydration failed:", error);
    dispatch(logout());
  }
};
