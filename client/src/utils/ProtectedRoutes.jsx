import React from "react";
import { getAutToken } from "./Auth";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const token = getAutToken();

  if (token == null) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
