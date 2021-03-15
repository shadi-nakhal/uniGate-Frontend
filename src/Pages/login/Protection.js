import React from "react";
import { Redirect, Route } from "react-router-dom";
import cookie from "../../Service/CookieService";

const ProtectedRoute = ({ children, ...rest }) => {
  const token = cookie.get("Bearer");
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (token) {
          return children;
        } else {
          return (
            <Redirect to={{ pathname: "/login", state: { from: location } }} />
          );
        }
      }}
    />
  );
};
export default ProtectedRoute;
