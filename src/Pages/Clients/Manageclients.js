import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { XGrid } from "@material-ui/x-grid";
import { Button } from "@material-ui/core";
import CookieService from "../../Service/CookieService";
import Typography from "@material-ui/core/Typography";
import NativeSelect from "@material-ui/core/NativeSelect";
import EditClient from "./Editclient";
import axios from "axios";

function ManageClient() {
  const [Client, setClient] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Editing, setEditing] = useState(false);
  const [ClientData, setClientData] = useState({});
  const useStyles = makeStyles((theme) => ({
    ClientTable: {
      zIndex: "0",
      height: "78vh",
      scroll: "none",
      color: "red",
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
  const ClientTable = useStyles();
  const cookie = CookieService.get("Bearer");

  const HandleEdit = () => {
    setEditing(!Editing);
  };

  const loadClient = async () => {
    setLoading(true);
    var config = {
      method: "get",
      url: "/clients",
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        setClient(
          res.data.map((item, index) => {
            return {
              ...item,
              delete: { id: item.id, image: item.image },
              edit: { id: item.id, index: index },
              address: item.address,
              project: item.projects,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err.request);
      });
    setLoading(false);
  };

  const DeleteClient = async (id) => {
    setLoading(true);
    var config = {
      method: "Delete",
      url: `/client/${id}`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    axios(config)
      .then((res) => {
        loadClient();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    loadClient();
  }, [Editing]);

  const columns = [
    { field: "id", headerName: "ID", width: 55 },
    {
      field: "fullName",
      headerName: "Fullname",
      width: 150,
      valueGetter: (params) => `${params.getValue("name")}`,
    },

    { field: "email", headerName: "Email", width: 180 },
    { field: "phone", headerName: "Phone", width: 120 },
    {
      field: "address",
      headerName: "Address",
      width: 230,
    },
    {
      field: "projects",
      headerName: "Projects",
      width: 180,
      renderCell: (params) => (
        <NativeSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          className={ClientTable.selectEmpty}
          value={0}
        >
          {params.value.map((item, index) => {
            return (
              <option id="projects-list" key={index} value={index}>
                {item.name}
              </option>
            );
          })}
        </NativeSelect>
      ),
    },
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
            setClientData(Client[params.value.index]);
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
          onClick={() => DeleteClient(params.value.id)}
          style={{ backgroundColor: "#F76363" }}
          variant="contained"
          size="small"
          alt="delete"
        >
          Delete
        </Button>
      ),
    },
  ];

  if (Editing) {
    return (
      <div>
        <EditClient ClientData={ClientData} HandleEdit={HandleEdit} />
      </div>
    );
  } else {
    return (
      <div>
        <Typography className={ClientTable.title} component="h1" variant="h5">
          Clients Manager
        </Typography>
        <div className={ClientTable.ClientTable}>
          <XGrid
            loading={Loading}
            rows={Client}
            columns={columns}
            pageSize={6}
            rowHeight={30}
          />
        </div>
      </div>
    );
  }
}

export default ManageClient;
