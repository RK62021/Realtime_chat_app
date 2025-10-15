import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { usernameSetupThunk } from "../features/auth/authThunk.js";
import { toast } from "react-toastify";
import { API_URL } from "../config/index.js"; // or VITE_API_BASE_URL

const USERNAME_REGEX = /^[a-z0-9_\.]{3,20}$/;

export default function UsernameModal() {
  const { needSetup, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [username, setUsernameInput] = useState("");
  const [available, setAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  if (!needSetup) return null;

  const validationMessage = useMemo(() => {
    if (!username) return "";
    if (!USERNAME_REGEX.test(username)) {
      return "3-20 chars, lowercase letters, numbers, _ or .";
    }
    return "";
  }, [username]);

  const canSubmit = username.length >= 3 && USERNAME_REGEX.test(username) && available === true && !checking && !loading;

  // --- Check username availability with debounce ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!username || !USERNAME_REGEX.test(username)) {
        setAvailable(null);
        setChecking(false);
        return;
      }
      
      setChecking(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/auth/username-availability/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvailable(data.data.available);
      } catch (err) {
        setAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500); // debounce
    return () => clearTimeout(timer);
  }, [username, token]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const { data } = await dispatch(usernameSetupThunk({ username })).unwrap();
      toast.success("Username set successfully! 🎉");
    } catch (err) {
      toast.error("Failed to set username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        {/* Decorative blur elements */}
        <div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/20 blur-2xl rounded-full" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-fuchsia-500/20 blur-2xl rounded-full" />
        
        <div className="relative p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white text-center">
            Choose your username
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            This is how others will find you.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase())}
                  placeholder="your_name"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-24 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs">
                  {checking && <span className="text-gray-400">Checking…</span>}
                  {!checking && username && available === true && <span className="text-emerald-400">Available</span>}
                  {!checking && username && available === false && <span className="text-rose-400">Taken</span>}
                </div>
              </div>
              {validationMessage && (
                <p className="mt-1 text-xs text-rose-300">{validationMessage}</p>
              )}
              {!validationMessage && username && (
                <p className="mt-1 text-xs text-gray-400">
                  3-20 chars, lowercase letters, numbers, _ or .
                </p>
              )}
            </div>

            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="w-full rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
