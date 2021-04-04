import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { XGrid } from "@material-ui/x-grid";
import { Button } from "@material-ui/core";
import CookieService from "../../Service/CookieService";
import UserContext from "../../Service/UserContext";
import Typography from "@material-ui/core/Typography";
import EditProject from "./Editproject";
import axios from "axios";

function ManageProject() {
  const { setUser, user } = useContext(UserContext);
  const [Project, setProject] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Editing, setEditing] = useState(false);
  const [ProjectData, setProjectData] = useState({});
  const useStyles = makeStyles((theme) => ({
    ProjectTable: {
      zIndex: "0",
      height: "78vh",
      scroll: "none",
      color: "red",
      width: "100%",
    },
    title: {
      marginBottom: "1%",
      marginTop: "1%",
      textAlign: "center",
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
      height: "100%",
    },
  }));
  const ProjectTable = useStyles();
  const cookie = CookieService.get("Bearer");

  const HandleEdit = () => {
    setEditing(!Editing);
  };

  const loadProject = async () => {
    setLoading(true);
    var config = {
      method: "get",
      url: "/projects",
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        setProject(
          res.data.map((item, index) => {
            return {
              ...item,
              delete: { id: item.id },
              edit: { id: item.id, index: index },
            };
          })
        );
      })
      .catch((err) => {
        console.log(err.request);
      });
    setLoading(false);
  };

  const DeleteProject = async (id) => {
    setLoading(true);
    var config = {
      method: "Delete",
      url: `/project/${id}`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    axios(config)
      .then((res) => {
        loadProject();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    loadProject();
  }, [Editing]);

  const columns = [
    { field: "id", headerName: "ID", width: 55 },
    {
      field: "project",
      headerName: "Project",
      width: 150,
      valueGetter: (params) => `${params.getValue("name")}`,
    },

    { field: "location", headerName: "Location", width: 150 },
    {
      field: "client",
      headerName: "Client.",
      width: 160,
      valueGetter: (params) => params.row.client.name,
    },
    {
      field: "Site Engineer",
      headerName: "Site Engineer",
      width: 160,
      valueGetter: (params) =>
        `${params.getValue("engineer_firstname")}` +
        " " +
        `${params.getValue("engineer_lastname")}`,
    },
    {
      field: "engineer_phone",
      headerName: "Site Engineer No.",
      width: 160,
    },
    {
      field: "engineer_email",
      headerName: "Site Engineer Email.",
      width: 160,
    },
    {
      field: "contact_name",
      headerName: "Site Contact",
      width: 160,
      valueGetter: (params) =>
        `${params.getValue("contact_firstname")}` +
        " " +
        `${params.getValue("contact_lastname")}`,
    },
    {
      field: "contact_phone",
      headerName: "Site Contact No.",
      width: 160,
    },
    {
      field: "contact_email",
      headerName: "Site Contact Email.",
      width: 160,
    },
    // {
    //   field: "projects",
    //   headerName: "Projects",
    //   width: 180,
    //   renderCell: (params) => (
    //     <NativeSelect
    //       labelId="demo-simple-select-label"
    //       id="demo-simple-select"
    //       className={ProjectTable.selectEmpty}
    //       value={0}
    //     >
    //       {params.value.map((item, index) => {
    //         return (
    //           <option id="projects-list" key={index} value={index}>
    //             {item.name}
    //           </option>
    //         );
    //       })}
    //     </NativeSelect>
    //   ),
    // },
  ];

  if (user.user.role == "Head of lab") {
    let con = [
      {
        field: "edit",
        headerName: "Edit",
        renderCell: (params) => (
          <Button
            style={{ backgroundColor: "#36C14B" }}
            variant="outlined"
            color="light"
            size="small"
            alt="edit"
            onClick={() => {
              setProjectData(Project[params.value.index]);
              setEditing(true);
            }}
          >
            Edit
          </Button>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
        sortable: false,
        renderCell: (params) => (
          <Button
            onClick={() => DeleteProject(params.value.id)}
            style={{
              backgroundColor: "#F76363",
            }}
            variant="contained"
            size="small"
            alt="delete"
          >
            Delete
          </Button>
        ),
      },
    ];

    columns.splice(1, 0, ...con);
  }

  if (Editing) {
    return (
      <div>
        <EditProject ProjectData={ProjectData} HandleEdit={HandleEdit} />
      </div>
    );
  } else {
    return (
      <div>
        <Typography className={ProjectTable.title} component="h1" variant="h5">
          Projects Book
        </Typography>
        <div className={ProjectTable.ProjectTable}>
          <XGrid
            loading={Loading}
            rows={Project}
            columns={columns}
            pageSize={6}
            rowHeight={30}
          />
        </div>
      </div>
    );
  }
}

export default ManageProject;
