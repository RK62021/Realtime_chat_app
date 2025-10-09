import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const Protected = ({ children }) => {
  console.log("Rendering Protected Route");
  const { isAuthenticated, needSetup, rehydrated } = useSelector(
    (state) => state.auth
  );

  if (!rehydrated) return null; // wait until rehydration is done
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (needSetup) return <Navigate to="/onboarding/username" replace />;

  return children;
};

export default Protected;
