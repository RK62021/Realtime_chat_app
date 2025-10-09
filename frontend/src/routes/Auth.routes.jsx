const SetupRoute = ({ children }) => {
   const { isAuthenticated, needSetup, rehydrated } = useSelector(
    (state) => state.auth
  );

  if (!rehydrated) return null; // wait until rehydration is done
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!needSetup) return <Navigate to="/dashboard" replace />;
};

export default SetupRoute;

