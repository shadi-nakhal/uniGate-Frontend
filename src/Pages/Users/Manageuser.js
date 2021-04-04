import React, { useState, useEffect } from "react";
import { XGrid } from "@material-ui/x-grid";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@material-ui/core";
import CookieService from "../../Service/CookieService";
import Typography from "@material-ui/core/Typography";
import AlertDialog from "./confirmation";
import EditUser from "./Edituser";
import axios from "axios";

function ManageUser({ update }) {
  const [Users, setUsers] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Editing, setEditing] = useState(false);
  const [UserData, setUserData] = useState({});
  const [Dialog, setDialog] = useState(false);
  const [delId, setdelId] = useState("");

  const handleClickOpen = (id) => {
    setDialog(true);
    setdelId(id);
  };

  const handleClose = () => {
    setDialog(false);
    setdelId("");
  };
  const useStyles = makeStyles((theme) => ({
    usersTable: {
      zIndex: "0",
      height: "78vh",
      scroll: "none",
      width: "100%",
    },
    title: {
      marginBottom: "1%",
      marginTop: "1%",
      textAlign: "center",
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
      url: "usersearch",
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

  const Delete = async () => {
    setLoading(true);
    var config = {
      method: "Delete",
      url: `/user/${delId}`,
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
      width: 100,
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
      width: 180,
      valueGetter: (params) =>
        `${params.getValue("firstname") || ""} ${
          params.getValue("lastname") || ""
        }`,
    },

    { field: "role", headerName: "Role", width: 170 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "mobile", headerName: "Phone", width: 200 },
    { field: "ext", headerName: "Ext", width: 200 },
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
          onClick={() => handleClickOpen(params.value.id)}
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
        <EditUser UserData={UserData} HandleEdit={HandleEdit} update={update} />
      </div>
    );
  } else {
    return (
      <div>
        <Typography className={usersTable.title} component="h1" variant="h5">
          Users Manager
        </Typography>
        <AlertDialog
          handleClose={handleClose}
          Delete={Delete}
          Dialog={Dialog}
        />
        <div className={usersTable.usersTable}>
          <XGrid
            pagination
            loading={Loading}
            rows={Users}
            columns={columns}
            pageSize={6}
            rowHeight={30}
          />
        </div>
      </div>
    );
  }
}

export default ManageUser;
