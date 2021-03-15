import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@material-ui/core";
import CookieService from "../../Service/CookieService";
import Typography from "@material-ui/core/Typography";
import EditUser from "./Edituser";
import axios from "axios";

function ManageUser() {
  const [Users, setUsers] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Editing, setEditing] = useState(false);
  const [UserData, setUserData] = useState({});
  const useStyles = makeStyles((theme) => ({
    usersTable: {
      zIndex: "0",
      width: "78vw",
      height: "78vh",
      scroll: "none",
      color: "red",
    },
    title: {
      marginBottom: "1%",
      marginTop: "1%",
      textAlign: "center",
      marginRight: "7%",
    },
  }));
  const usersTable = useStyles();
  const cookie = CookieService.get("Bearer");
  const linkkk = "http://localhost:8000/storage/images/";

  const HandleEdit = () => {
    setEditing(!Editing);
  };

  const loadUsers = async () => {
    setLoading(true);
    var config = {
      method: "get",
      url: "http://localhost:8000/api/usersearch",
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        setUsers(
          res.data.map((item, index) => {
            return {
              ...item,
              delete: { id: item.id, image: item.image },
              edit: { id: item.id, index: index },
              image: linkkk + item.image,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err.request);
      });
    setLoading(false);
  };

  const DeleteUser = async (id) => {
    setLoading(true);
    var config = {
      method: "Delete",
      url: `http://localhost:8000/api/user/${id}`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    axios(config)
      .then((res) => {
        loadUsers();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [Editing]);

  const columns = [
    { field: "id", headerName: "ID", width: 65 },
    {
      field: "image",
      headerName: "Picture",
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Avatar
          style={{ width: "1", height: "1" }}
          alt="Remy Sharp"
          src={params.value}
        />
      ),
    },
    {
      field: "fullName",
      headerName: "Full name",
      width: 160,
      valueGetter: (params) =>
        `${params.getValue("firstname") || ""} ${
          params.getValue("lastname") || ""
        }`,
    },

    { field: "role", headerName: "Role", width: 130 },
    { field: "email", headerName: "Email", width: 160 },
    { field: "mobile", headerName: "Phone", width: 120 },
    { field: "ext", headerName: "Ext", width: 100 },
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (params) => (
        <Button
          style={{ backgroundColor: "#36C14B" }}
          variant="contained"
          size="small"
          alt="Remy Sharp"
          onClick={() => {
            setUserData(Users[params.value.index]);
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
          onClick={() => DeleteUser(params.value.id, params.value.image)}
          style={{ backgroundColor: "#F76363" }}
          variant="contained"
          size="small"
          alt="Remy Sharp"
        >
          Delete
        </Button>
      ),
    },
  ];

  if (Editing) {
    return (
      <div>
        <EditUser UserData={UserData} HandleEdit={HandleEdit} />
      </div>
    );
  } else {
    return (
      <div>
        <Typography className={usersTable.title} component="h1" variant="h5">
          Users Manager
        </Typography>
        <div className={usersTable.usersTable}>
          <DataGrid
            loading={Loading}
            rows={Users}
            columns={columns}
            pageSize={6}
          />
        </div>
      </div>
    );
  }
}

export default ManageUser;
