import React from "react";
import { getAutToken } from "./Auth";
import { Navigate } from "react-router-dom";

const AuthRoutes = ({ children }) => {
  const token = getAutToken();

  if (token !== null) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};

export default AuthRoutes;
