import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "../pages/NotFound.jsx";
import UsernameSetup from "../pages/UsernameSetup.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ChatRoom from "../pages/ChatRoom.jsx";
import Protected from "./protected.routes.jsx";
import SetupRoute from "./Auth.routes.jsx";
import GuestRoute from "./Guest.routes.jsx";

const AppRoutes = () => {
  // Temporary placeholders

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute>
            <Signup />
          </GuestRoute>
        } />
        <Route path="/forgot-password" element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        } />

        {/* username setup route */}
        <Route
          path="/onboarding/username"
          element={
            <SetupRoute>
              <UsernameSetup />
            </SetupRoute>
          }
        />

        {/* Protected Route  */}
        <Route
          path="/dashboard"
          element={
            <Protected>
              <ChatRoom />
            </Protected>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
