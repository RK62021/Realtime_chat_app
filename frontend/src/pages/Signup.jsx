import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../features/auth/authThunk";
import { toast } from "react-toastify";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Basic validation
  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (form.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      fullname: form.fullName,
      username: form.username,
      email: form.email,
      password: form.password,
    };

    console.log("Registering with payload:", payload);

    try {
      const result = await dispatch(registerThunk(payload)).unwrap();
      toast.success("Registration successful!");

      // Redirect based on needSetup
      if (result.needSetup) navigate("/onboarding/username");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err || "Registration failed");
      console.log("Registration error:", err);
    }
  };

  // Placeholder for Google OAuth
  const handleGoogle = () => {
    // TODO: integrate Google OAuth
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/20 blur-2xl rounded-full" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-fuchsia-500/20 blur-2xl rounded-full" />
        <div className="relative p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white text-center">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-300">
            Join the conversation in seconds.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-200"
              >
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="Jane Doe"
              />
              {errors.fullName && (
                <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-200"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="jane_doe"
              />
              {errors.username && (
                <p className="text-xs text-red-400 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="jane@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
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
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 transition-colors"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            {error && (
              <p className="text-xs text-red-400 mt-1 text-center">{error}</p>
            )}
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-gray-900 font-medium hover:bg-gray-100 transition-colors"
          >
            {/* Google Icon */}
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
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-3.897,5.707c0,0,0,0,0,0l6.143,5.192C35.016,35.253,44,30,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-300 hover:text-indigo-200 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
