import React, { useState } from "react";
import Sidebar from "./Components/Sidebar/sidebar.js";
import items from "./Components/Sidebar/SidebarData.js";
import Itemss from "./Components/Sidebar/SidebarData2.js";
import Navbar from "./Components/Navbar/Navbar.js";
import useVisible from "./Service/useVisible";
import Login from "./Pages/login/login";
import NewUser from "./Pages/Users/Newuser";
import Newclient from "./Pages/Clients/Newclient";
import Manageclients from "./Pages/Clients/Manageclients";
import UserContext from "./Service/UserContext";
import Protection from "./Pages/login/Protection";
import MyAccount from "./Pages/Users/MyAccount";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import axios from "axios";
import ManageUser from "./Pages/Users/Manageuser.js";
import NewProject from "./Pages/Projects/Newproject";
import ManageProjects from "./Pages/Projects/Manageproject";
import NewSample from "./Pages/Sample/NewSample/Newsample"; //newsample
import ManageSample from "./Pages/Sample/ManageSamples/ManageSample";
import Tasks from "./Pages/Tasks/ManageTasks/ManageTasks";
import TestRecords from "./Pages/Tests/TestRecords/TestRecords";
import NotFound from "./Pages/NotFound/NotFound";
import routes from "./Pages/login/routes";
import RoleBasedRouting from "./Pages/login/RoleBasedRouting";

require("dotenv").config();

function App() {
  const { ref, ref2, isVisible, setIsVisible } = useVisible(false);
  const [update, setupdate] = useState(false);
  const [user, setUser] = useState({
    user: { image: "avatar", firstname: "", lastname: "", role: "" },
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
          }}
        >
          <Router>
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Protection>
                <Navbar
                  items={Itemss(user)}
                  checksidebar={checksidebar}
                  isVisible={isVisible}
                  forwardedRef={ref2}
                  update={update}
                />
                <Sidebar
                  items={Itemss(user)}
                  checksidebar={checksidebar}
                  forwardedRef={ref}
                  isVisible={isVisible}
                />
                <RoleBasedRouting
                  exact
                  path="/ManageTasks"
                  component={Tasks}
                  roles={["Head of lab", "Technician"]}
                />
                <RoleBasedRouting
                  exact
                  path="/"
                  component={TestRecords}
                  roles={["Technician", "Head of lab"]}
                />
                <RoleBasedRouting
                  exact
                  path="/MyAccount"
                  component={MyAccount}
                  UserData={user.user}
                  update={triggerupdate}
                  roles={["Head of lab", "Technician"]}
                />
                <RoleBasedRouting
                  exact
                  path="/ManageProjects"
                  component={ManageProjects}
                  roles={["Head of lab", "Technician"]}
                />
                <RoleBasedRouting
                  exact
                  path="/NewSample"
                  component={NewSample}
                  roles={["Head of lab", "Technician"]}
                />
                <RoleBasedRouting
                  exact
                  path="/ManageSamples"
                  component={ManageSample}
                  roles={["Head of lab", "Technician"]}
                />
                <RoleBasedRouting
                  exact
                  path="/newuser"
                  component={NewUser}
                  roles={["Head of lab"]}
                />
                <RoleBasedRouting
                  exact
                  path="/ManageUsers"
                  component={ManageUser}
                  roles={["Head of lab"]}
                  update={triggerupdate}
                />

                <RoleBasedRouting
                  exact
                  path="/Newclient"
                  component={Newclient}
                  roles={["Head of lab"]}
                />
                <RoleBasedRouting
                  exact
                  path="/ManageClients"
                  component={Manageclients}
                  roles={["Head of lab"]}
                />
                <RoleBasedRouting
                  exact
                  path="/NewProject"
                  component={NewProject}
                  roles={["Head of lab"]}
                />
              </Protection>
            </Switch>
            <Redirect from="/*" to="/" />
          </Router>
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
