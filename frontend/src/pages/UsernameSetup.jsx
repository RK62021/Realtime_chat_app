import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const USERNAME_REGEX = /^[a-z0-9_\.]{3,20}$/;

export default function UsernameSetup() {
	const [username, setUsername] = useState("");
	const [checking, setChecking] = useState(false);
	const [available, setAvailable] = useState(null);

	const validationMessage = useMemo(() => {
		if (!username) return "";
		if (!USERNAME_REGEX.test(username)) {
			return "3-20 chars, lowercase letters, numbers, _ or .";
		}
		return "";
	}, [username]);

	const canSubmit = username.length >= 3 && USERNAME_REGEX.test(username) && available === true && !checking;

	const checkAvailability = async (value) => {
		setChecking(true);
		setAvailable(null);
		try {
			// TODO: call API `/api/users/check-username?u=${value}`
			await new Promise((r) => setTimeout(r, 600));
			// Simulate: mark some taken examples
			const taken = ["admin", "root", "support", "test"];
			setAvailable(!taken.includes(value));
		} finally {
			setChecking(false);
		}
	};

	const handleChange = (e) => {
		const value = e.target.value.toLowerCase();
		setUsername(value);
		if (value.length >= 3 && USERNAME_REGEX.test(value)) {
			checkAvailability(value);
		} else {
			setAvailable(null);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!canSubmit) return;
		// TODO: POST to `/api/users/set-username` with { username }
	};

	return (
		<div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex items-center justify-center p-6">
			<div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
				<div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/20 blur-2xl rounded-full" />
				<div className="absolute -bottom-6 -left-6 h-24 w-24 bg-fuchsia-500/20 blur-2xl rounded-full" />

				<div className="relative p-8">
					<h1 className="text-2xl font-semibold tracking-tight text-white text-center">Choose your username</h1>
					<p className="mt-2 text-center text-sm text-gray-300">This is how others will find you.</p>

					<form onSubmit={handleSubmit} className="mt-8 space-y-4">
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
							<div className="mt-1 relative">
								<input
									id="username"
									name="username"
									type="text"
									autoComplete="off"
									required
									value={username}
									onChange={handleChange}
									className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pr-24 text-white placeholder-gray-400 outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/30"
									placeholder="your_name"
								/>
								<div className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs">
									{checking && <span className="text-gray-400">Checking…</span>}
									{!checking && available === true && <span className="text-emerald-400">Available</span>}
									{!checking && available === false && <span className="text-rose-400">Taken</span>}
								</div>
							</div>
							{validationMessage && (
								<p className="mt-1 text-xs text-rose-300">{validationMessage}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={!canSubmit}
							className="w-full rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							Continue
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-gray-300">
						Signed in wrong account? <Link to="/login" className="text-indigo-300 hover:text-indigo-200 font-medium">Switch</Link>
					</p>
				</div>
			</div>
		</div>
	);
}


