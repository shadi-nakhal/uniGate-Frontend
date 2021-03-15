import React, { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar/sidebar.js";
import items from "./Components/Sidebar/SidebarData.js";
import Navbar from "./Components/Navbar/Navbar.js";
import useVisible from "./Service/useVisible";
import Login from "./Pages/login/login";
import NewUser from "./Pages/Users/Newuser";
import UserContext from "./Service/UserContext";
import Protection from "./Pages/login/Protection";
import MyAccount from "./Pages/Users/MyAccount";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import ManageUser from "./Pages/Users/Manageuser.js";
require("dotenv").config();

function App() {
  const { ref, ref2, isVisible, setIsVisible } = useVisible(false);
  const [update, setupdate] = useState(false);
  const [user, setUser] = useState({
    user: { image: "avatar", firstname: "", lastname: "" },
  });

  if (user) {
    axios.defaults.headers.common["Authorization"] =
      "bearer " + user.access_token;
  }

  axios.defaults.baseURL = "http://localhost:8000/api/";

  const checksidebar = () => {
    setIsVisible(!isVisible);
  };
  const triggerupdate = () => {
    setupdate(!update);
  };

  return (
    <div className="App" style={{ backgroundColor: "#c3e0dc" }}>
      <UserContext.Provider value={{ user, setUser }}>
        <div
          style={{
            paddingTop: "65px",
            paddingLeft: "15%",
            paddingRight: "15%",
          }}
        >
          <Router>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Protection>
                <Navbar
                  items={items}
                  checksidebar={checksidebar}
                  isVisible={isVisible}
                  forwardedRef={ref2}
                  update={update}
                />
                <Sidebar
                  items={items}
                  checksidebar={checksidebar}
                  forwardedRef={ref}
                  isVisible={isVisible}
                />
                <Route exact path="/newuser">
                  <NewUser />
                </Route>
                <Route exact path="/ManageUsers">
                  <ManageUser />
                </Route>
                <Route exact path="/MyAccount">
                  <MyAccount UserData={user.user} update={triggerupdate} />
                </Route>
              </Protection>
            </Switch>
          </Router>
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
