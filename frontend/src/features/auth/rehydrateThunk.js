import { jwtDecode } from "jwt-decode";
import { logout , loginSuccess } from "./authSlice.js";
import { API_URL } from "../../config/index.js";

// Thunk to rehydrate auth state from localStorage
export const rehydrateThunk = () => async (dispatch) => {
 try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
             // Token valid -> fetch user data
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                
        } // Token valid
    }
 } catch (error) {
    console.error("Rehydration error:", error);
    dispatch(logout());

 }
};
