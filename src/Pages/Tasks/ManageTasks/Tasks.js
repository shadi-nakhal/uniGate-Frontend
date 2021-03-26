import React, { useState, useContext, useEffect, useCallback } from "react";
import ReactDataGrid from "react-data-grid";
import Button from "@material-ui/core/Button";
import CookieService from "../../../Service/CookieService";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import { Typography } from "@material-ui/core";
import AddTest from "./AddTest/AddTest";

const Tasks = React.memo(() => {
  const cookie = CookieService.get("Bearer");
  const [Tasks, setTasks] = useState();
  const [rows, setRows] = useState([]);
  const [HandleData, setHandleData] = useState({});
  const [Handling, setHandling] = useState(false);

  const defaultColumnProperties = {
    resizable: true,
  };

  const ProgressBarFormatter = ({ value }) => {
    return (
      <Chip
        label={value ? "Completed" : "Pending"}
        size="small"
        style={{
          backgroundColor: value ? "green" : "#E2F43F",
          color: "black",
          width: "150px",
        }}
      />
    );
  };

  const HandleTask = useCallback((value) => {
    setHandleData(value);
    setHandling(!Handling);

    console.log(value);
  }, []);

  const HandleTaskButton = (val) => {
    return [
      {
        icon: (
          <Button
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
    { key: "created_at", name: "created_at", width: 170 },
    { key: "handle", name: "Handle", width: 80 },
  ].map((c) => ({ ...c, ...defaultColumnProperties }));

  const fetchSelectData = async () => {
    var config = {
      method: "get",
      url: `/tasks`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSelectData();
  }, []);

  if (Handling) {
    return (
      <div>
        <AddTest HandleData={HandleData} Handling={Handling} />
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
          style={{ textAlign: "center", margin: "20px" }}
        >
          Tasks
        </Typography>
        <ReactDataGrid
          columns={columns}
          getCellActions={getCellActions}
          rowGetter={(i) => {
            return rows[i];
          }}
          rowsCount={rows.length + 1}
          onColumnResize={(idx, width) =>
            console.log(`Column ${idx} has been resized to ${width}`)
          }
        />
      </div>
    );
  }
});

export default Tasks;
