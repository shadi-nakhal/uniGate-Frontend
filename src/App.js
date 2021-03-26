import React, { useState } from "react";
import Sidebar from "./Components/Sidebar/sidebar.js";
import items from "./Components/Sidebar/SidebarData.js";
import Navbar from "./Components/Navbar/Navbar.js";
import useVisible from "./Service/useVisible";
import Login from "./Pages/login/login";
import NewUser from "./Pages/Users/Newuser";
import Newclient from "./Pages/Clients/Newclient";
import Manageclients from "./Pages/Clients/Manageclients";
import UserContext from "./Service/UserContext";
import Protection from "./Pages/login/Protection";
import MyAccount from "./Pages/Users/MyAccount";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import ManageUser from "./Pages/Users/Manageuser.js";
import NewProject from "./Pages/Projects/Newproject";
import ManageProject from "./Pages/Projects/Manageproject";
import NewSample from "./Pages/Sample/NewSample/Newsample"; //newsample
import ManageSample from "./Pages/Sample/ManageSamples/ManageSample";
import Tasks from "./Pages/Tasks/ManageTasks/Tasks";
import AddTest from "./Pages/Tests/AddTest/AddTest";

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
            paddingTop: "58px",
            // paddingLeft: "7%",
            // paddingRight: "7%",
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
                  <ManageUser update={triggerupdate} />
                </Route>
                <Route exact path="/MyAccount">
                  <MyAccount UserData={user.user} update={triggerupdate} />
                </Route>
                <Route exact path="/Newclient">
                  <Newclient />
                </Route>
                <Route exact path="/ManageClients">
                  <Manageclients />
                </Route>
                <Route exact path="/NewProject">
                  <NewProject />
                </Route>
                <Route exact path="/ManageProjects">
                  <ManageProject />
                </Route>
                <Route exact path="/NewSample">
                  <NewSample />
                </Route>
                <Route exact path="/ManageSamples">
                  <ManageSample />
                </Route>
                <Route exact path="/ManageTasks">
                  <Tasks />
                </Route>
                <Route exact path="/AddTest">
                  <AddTest />
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
