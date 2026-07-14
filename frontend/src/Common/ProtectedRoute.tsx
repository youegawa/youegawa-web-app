import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const context = useContext(AuthContext);

  const hasStoredUser = (() => {
    try {
      return localStorage.getItem("user") !== null;
    } catch {
      return false;
    }
  })();

  if (!context) {
    return hasStoredUser ? children : <Navigate to="/login" replace />;
  }

  const { isAuthenticated } = context;

  if (!isAuthenticated && !hasStoredUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
