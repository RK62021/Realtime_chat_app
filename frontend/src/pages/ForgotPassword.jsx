import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			// TODO: call password reset API
			await new Promise((r) => setTimeout(r, 600));
			setSent(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex items-center justify-center p-6">
			<div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
				<div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/20 blur-2xl rounded-full" />
				<div className="absolute -bottom-6 -left-6 h-24 w-24 bg-fuchsia-500/20 blur-2xl rounded-full" />

				<div className="relative p-8">
					<h1 className="text-2xl font-semibold tracking-tight text-white text-center">Reset your password</h1>
					<p className="mt-2 text-center text-sm text-gray-300">Enter your email and we'll send you a reset link.</p>

					{sent ? (
						<div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-200">
							We've sent a reset link to {email}. Check your inbox.
						</div>
					) : (
						<form onSubmit={handleSubmit} className="mt-8 space-y-4">
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
									placeholder="you@example.com"
								/>
							</div>

							<button disabled={loading} type="submit" className="mt-2 w-full rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50 transition-colors">
								Send reset link
							</button>
						</form>
					)}

					<p className="mt-6 text-center text-sm text-gray-300">
						Back to <Link to="/login" className="text-indigo-300 hover:text-indigo-200 font-medium">Sign in</Link>
					</p>
				</div>
			</div>
		</div>
	);
}


