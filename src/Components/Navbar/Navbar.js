import React, { useContext, useEffect } from "react";
import { IconContext } from "react-icons";
import * as FaIcons from "react-icons/fa";
import Cookie from "../../Service/CookieService";
import Button from "@material-ui/core/Button";
import UserContext from "../../Service/UserContext";
import UserMenu from "./UserMenu";
import axios from "axios";
require("dotenv").config();

function Navbar({ checksidebar, forwardedRef, isVisible, update }) {
  const { setUser, user } = useContext(UserContext);

  useEffect(() => {
    async function load() {
      const cookie = Cookie.get("Bearer");
      var config = {
        method: "get",
        url: "/profile",
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err, "navbar profile");
        });
    }
    load();
  }, [update, setUser]);

  return (
    <IconContext.Provider value={{ color: isVisible ? "#ADBCBA" : "#59ecdb" }}>
      <div className="navbarr">
        <Button
          onClick={checksidebar}
          className="menu-bars-active"
          ref={forwardedRef}
        >
          <FaIcons.FaBars />
        </Button>
        <div className="head-title">
          <h4>
            Un<span style={{ color: "#FF2A00" }}>i</span>Gate
          </h4>
        </div>
        <UserMenu user={user.user} />
      </div>
    </IconContext.Provider>
  );
}

export default Navbar;
