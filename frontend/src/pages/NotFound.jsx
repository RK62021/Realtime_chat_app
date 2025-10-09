import { Link } from "react-router-dom";

const NotFound = () => (
	<div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6">
		{/* Decorative background blobs */}
		<div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
		<div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

		<div className="relative z-10 w-full max-w-lg rounded-2xl border border-blue-200 bg-white/60 backdrop-blur-md shadow-xl">
			<div className="p-8 md:p-10 text-center">
				<h1 className="text-7xl md:text-8xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">404</h1>
				<h2 className="text-xl md:text-2xl font-semibold mb-3 text-blue-700">Page not found</h2>
				<p className="text-sm md:text-base text-blue-500 mb-8">
					The page you’re looking for doesn’t exist or has been moved.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
					<Link
						to="/dashboard"
						className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
					>
						Go to Dashboard
					</Link>
					<Link
						to="/"
						className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 border border-blue-200 bg-white hover:bg-blue-100 transition-colors"
					>
						Back to Home
					</Link>
				</div>

				<div className="mt-6 text-xs text-blue-400/80">
					Need help? Reach out to support.
				</div>
			</div>
		</div>
	</div>
);

export default NotFound;
