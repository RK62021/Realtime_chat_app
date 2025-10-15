// App.jsx
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import store from "../src/store/store.js";
import AppRoutes from "./routes/App.routes.jsx";
import { rehydrate } from "./features/auth/authSlice.js";
import { rehydrateThunk } from "./features/auth/rehydrateThunk.js";
import CustomToastContainer from "./components/CustomToastContainer.jsx";
import Layout from "./components/Layout.jsx";

// ✅ Component that handles auth rehydration
function AuthLoader({ children }) {
  const dispatch = useDispatch();
  const { rehydrated } = useSelector((state) => state.auth);

  useEffect(() => {
    // 1️⃣ Restore token from localStorage (sync)
    dispatch(rehydrate());

    // 2️⃣ Async validation / refresh / fetch user
    dispatch(rehydrateThunk());
  }, [dispatch]);

  // ⏳ Show beautiful loading screen while rehydration is in progress
  if (!rehydrated) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(1000px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(800px_500px_at_110%_110%,rgba(147,51,234,0.25),transparent)] bg-slate-950 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          {/* Decorative blur elements */}
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-500/20 blur-2xl rounded-full" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-fuchsia-500/20 blur-2xl rounded-full" />
          
          <div className="relative p-8 text-center">
            {/* Animated logo/icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-0.5">
                  <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
                {/* Spinning ring */}
                <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-transparent border-t-indigo-400 animate-spin"></div>
              </div>
            </div>
            
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
              Loading Session
            </h1>
            <p className="text-sm text-gray-300 mb-6">
              Restoring your chat experience...
            </p>
            
            {/* Loading dots animation */}
            <div className="flex justify-center space-x-1">
              <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Once rehydrated, render children (AppRoutes)
  return children;
}

function App() {
  return (
    <Provider store={store}>
      <AuthLoader>
        <AppRoutes />
      </AuthLoader>

      <CustomToastContainer />
    </Provider>
  );
}

export default App;
