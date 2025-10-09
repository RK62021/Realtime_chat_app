import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import store from "../src/store/store.js";
import AppRoutes from "./routes/App.routes.jsx";
import { rehydrate } from "./features/auth/authSlice.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Component that rehydrates auth on mount
function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrate());
  }, [dispatch]);

  return null; // Doesn't render anything
}

function App() {
  return (
    <Provider store={store}>
      <AuthLoader /> {/* Dispatches rehydrate once */}
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
}

export default App;
