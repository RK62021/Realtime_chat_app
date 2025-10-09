import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, rehydrated } = useSelector((state) => state.auth);

  if (!rehydrated) return null; // wait for rehydration
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

export default GuestRoute;
