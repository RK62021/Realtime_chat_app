import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginThunk } from "../features/auth/authThunk.js";
import { showToast, toastMessages } from "../utils/toast";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { username: form.identifier, password: form.password };

    try {
      const result = await dispatch(loginThunk(payload)).unwrap();
      console.log(result);

      showToast.success(toastMessages.auth.loginSuccess);
    } catch (err) {
      const errorMsg =
        typeof err === "string"
          ? err
          : err?.message || toastMessages.auth.loginError;

        

      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/20 blur-2xl rounded-full" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-fuchsia-500/20 blur-2xl rounded-full" />

        <div className="relative p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white text-center">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-gray-300">
            Sign in to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-200"
              >
                Username or Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={form.identifier}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="username or you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/10"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-indigo-300 hover:text-indigo-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50 transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="my-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-white/10" />
            <span className="text-xs uppercase tracking-wide text-gray-400">
              or
            </span>
            <div className="h-px w-16 bg-white/10" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-gray-900 font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.156,7.957,3.043l5.657-5.657C33.888,6.053,29.184,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.156,7.957,3.043l5.657-5.657C33.888,6.053,29.184,4,24,4C16.318,4,9.865,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.812-1.977,13.289-5.191l-6.143-5.192C29.927,35.091,27.148,36,24,36c-5.202,0-9.619-3.317-11.281-7.946l-6.49,5.002C9.777,39.556,16.365,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-3.897,5.707l6.143,5.192C35.016,35.253,44,30,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-300 hover:text-indigo-200 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
