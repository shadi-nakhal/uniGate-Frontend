import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import cookie from "../../Service/CookieService";
import UserContext from "../../Service/UserContext";
import itemz from "./routes";

const ProtectedRoute = ({ children, ...rest }) => {
  const { setUser, user } = useContext(UserContext);
  const pathname = rest.location.pathname;

  // const checking = () => {
  //   let check = itemz.filter(
  //     (x) => x.path == pathname && x.role.includes(user.user.role)
  //   );
  //   return check;
  // };

  const token = cookie.get("Bearer");

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!token) {
          return (
            <Redirect to={{ pathname: "/login", state: { from: location } }} />
          );
        } else if (token) {
          return children;
        }
      }}
    />
  );
};
export default ProtectedRoute;
