import React, { useContext, useState, useCallback, useEffect } from "react";
import UserContext from "../../Service/UserContext";
import cookie from "../../Service/CookieService";
import { Redirect, Route } from "react-router-dom";
import NotFound from "../NotFound/NotFound";
import { logRoles } from "@testing-library/dom";

export default function RoleBasedRouting({
  component: Component,
  roles,
  ...rest
}) {
  const { setUser, user } = useContext(UserContext);
  const [state, setstate] = useState(roles);

  const grantPermission = () => {
    const permittedRoles = user.user.role;
    if (state.includes(permittedRoles)) {
      return true;
    } else return false;
  };

  // useEffect(() => {
  //   const permittedRoles = user.user.role;
  //   if (roles.includes(permittedRoles)) {
  //     setgrant(true);
  //   } else setgrant(false);
  //   return () => {
  //     setgrant(false);
  //   };
  // }, []);

  console.log(grantPermission(roles));

  if (grantPermission(roles)) {
    return (
      <Route
        {...rest}
        render={() => {
          return (
            <>
              <Component {...rest} />
            </>
          );
        }}
      />
    );
  } else return <></>;
  //  else {
  //   return (
  //     <Route
  //       render={() => {
  //         return (
  //           <>
  //             <NotFound />
  //           </>
  //         );
  //       }}
  //     />
  //   );
  // }

  // return (
  //   <>
  //     {grantPermission(roles) && (
  //       <Route
  //         {...rest}
  //         render={() => {
  //           return (
  //             <>
  //               <Component {...rest} />
  //             </>
  //           );
  //         }}
  //       />
  //     )}
  //     {!grantPermission(roles) && (
  //       <Route
  //         render={() => {
  //           return (
  //             <>
  //               <NotFound />
  //             </>
  //           );
  //         }}
  //       />
  //     )}
  //   </>
  // );
}
