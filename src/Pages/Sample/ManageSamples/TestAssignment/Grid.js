import React, { useState, useContext, useEffect, useCallback } from "react";
import ReactDataGrid from "react-data-grid";
import Button from "@material-ui/core/Button";
import CookieService from "../../../../Service/CookieService";
import Chip from "@material-ui/core/Chip";
import axios from "axios";

const Grid = React.memo(
  ({ update, SampleData, HandleMessage, HandleDisplay }) => {
    const cookie = CookieService.get("Bearer");
    const [Tasks, setTasks] = useState();
    const [rows, setRows] = useState([]);

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

    const DeleteTask = async (id) => {
      var config = {
        method: "Delete",
        url: `/task/${id}`,
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          fetchSelectData();
          HandleMessage("Task has been deleted !");
          HandleDisplay({ display: "inline", margin: "10px", color: "red" });
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.errors) {
            HandleMessage(
              Object.entries(error.response.data.errors).map(
                (item) => " " + item[1] + ","
              )
            );
            HandleDisplay({ display: "inline", margin: "10px", color: "Red" });
          } else {
            HandleMessage("N e t w o r k  E r r o r");
            HandleDisplay({ display: "inline", margin: "10px", color: "Red" });
          }
        });
    };

    const DeleteButton = (val) => {
      return [
        {
          icon: (
            <Button
              style={{ backgroundColor: "#F76363" }}
              onClick={() => DeleteTask(val)}
              variant="contained"
              size="small"
            >
              Delete
            </Button>
          ),
          callback: (val) => null,
        },
      ];
    };

    function getCellActions(column, row) {
      const cellActions = {
        delete: DeleteButton(row.id),
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
      { key: "created_at", name: "created_at" },
      { key: "delete", name: "delete", width: 70 },
    ].map((c) => ({ ...c, ...defaultColumnProperties }));

    const fetchSelectData = async () => {
      var config = {
        method: "get",
        url: `/task/${SampleData.type}/${SampleData.id}`,
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          console.log(res);
          setRows(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    useEffect(() => {
      fetchSelectData();
    }, [update]);

    return (
      <div
        style={{
          display: "flex",
          alignContent: "center",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
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
);

export default Grid;
