import React, { useState, useContext, useEffect, useCallback } from "react";
import ReactDataGrid from "react-data-grid";
import Button from "@material-ui/core/Button";
import CookieService from "../../../Service/CookieService";
import UserContext from "../../../Service/UserContext";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import { Typography } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import AddTest from "./AddTest/AddTest";

const Tasks = React.memo(() => {
  const cookie = CookieService.get("Bearer");
  const { setUser, user } = useContext(UserContext);
  const [Tasks, setTasks] = useState();
  const [rows, setRows] = useState([]);
  const [HandleData, setHandleData] = useState({});
  const [Handling, setHandling] = useState(false);
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({});
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const defaultColumnProperties = {
    resizable: true,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const ProgressBarFormatter = ({ value }) => {
    return (
      <Chip
        label={value}
        size="small"
        style={{
          backgroundColor:
            value == "Completed"
              ? "green"
              : value == "Over due"
              ? "#ff8787"
              : value == "Pending"
              ? "#5c7cfa"
              : "#fab005",
          color: "black",
          width: "150px",
        }}
      />
    );
  };

  const HandleTask = useCallback((value) => {
    setHandleData(value);
    setHandling(true);
  }, []);

  const HandleToggle = useCallback((value) => {
    setHandling(false);
  }, []);

  const HandleTaskButton = (val) => {
    let disabled = true;
    if (val.status == "Pending" || val.status == "Warning") {
      disabled = false;
    }
    return [
      {
        icon: (
          <Button
            disabled={disabled}
            style={{ backgroundColor: "#36C14B" }}
            onClick={() => HandleTask(val)}
            variant="contained"
            size="small"
          >
            Handle
          </Button>
        ),
        callback: (val) => null,
      },
    ];
  };

  function getCellActions(column, row) {
    const cellActions = {
      handle: HandleTaskButton(row),
    };
    return cellActions[column.key];
  }

  const columns = [
    { key: "id", name: "ID", width: 65 },
    { key: "technician_name", name: "Technician" },
    { key: "test_name", name: "Test" },
    { key: "sample_type", name: "Sample Type" },
    { key: "sample_ref", name: "Sample Reference" },
    { key: "status", name: " status", formatter: ProgressBarFormatter },
    { key: "test_date", name: "Test date", width: 170 },
    { key: "created_at", name: "Assigned at", width: 170 },
  ].map((c) => ({ ...c, ...defaultColumnProperties }));

  if (user.user.role == "Head of lab" || user.user.role == "Technician") {
    let con = [{ key: "handle", name: "Handle", width: 80 }];
    let index = columns.length;
    columns.splice(index, 0, ...con);
  }

  const fetchSelectData = async () => {
    var config = {
      method: "get",
      url: `/tasks?page=${page + 1}`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        setRows(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSelectData();
  }, [page]);

  if (Handling) {
    return (
      <div>
        <AddTest
          HandleData={HandleData}
          Handling={Handling}
          HandleToggle={HandleToggle}
        />
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          style={{ textAlign: "center", margin: "20px", marginRight: "15px" }}
        >
          Tasks
        </Typography>
        <ReactDataGrid
          columns={columns}
          getCellActions={getCellActions}
          minHeight={500}
          rowGetter={(i) => {
            return rows[i];
          }}
          rowsCount={rows.length + 1}
        />
        <TablePagination
          component="div"
          count={meta.total}
          page={page}
          onChangePage={handleChangePage}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    );
  }
});

export default Tasks;
