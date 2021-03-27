import React, { useState, useContext, useEffect, useCallback } from "react";
import ReactDataGrid from "react-data-grid";
import Button from "@material-ui/core/Button";
import CookieService from "../../../Service/CookieService";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import { Typography } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import Select from "react-select";

const TestRecords = React.memo(() => {
  const cookie = CookieService.get("Bearer");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({});
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [Types, setTypes] = useState([]);
  const [SampType, setSampType] = useState({
    value: "sand",
    label: "Materials",
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const HandleTypes = useCallback(
    (e) => {
      setSampType({ value: e.value.toLowerCase(), label: e.label });
    },
    [SampType]
  );

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "#C3E0DC",
      width: 300,
      margin: "0px",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      border: "1px dotted #305c54",
      color: state.isFocused ? "#305c54" : "#305c54",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "#C3E0DC",
      width: 300,
      color: "black",
    }),
    control: () => ({
      display: "flex",
      width: 300,
      border: "1px solid black",
      color: "black",
    }),
  };

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

  const HandleTaskButton = (val) => {
    return [
      {
        icon: (
          <Button
            style={{ backgroundColor: "#36C14B" }}
            // onClick={() => HandleTask(val)}
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
    { key: "sample_ref", name: "Sample Reference" },
    { key: "sample_type", name: "Sample Type" },
    { key: "sample_description", name: "Sample description" },
    { key: "test_name", name: "Test" },
    { key: "test_date", name: "Test Date" },
    // { key: "status", name: " status", formatter: ProgressBarFormatter },
    { key: "created_at", name: "created_at", width: 170 },
  ].map((c) => ({ ...c, ...defaultColumnProperties }));
  const LoadTests = async () => {
    let url = SampType.value;
    var config = {
      method: "get",
      url: `${url}?page=${page + 1}`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        setMeta(res.data.meta);
        setRows(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(page);
  useEffect(() => {
    async function fetchSelectData() {
      var config = {
        method: "get",
        url: "/testrecord",
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          setTypes(res.data.tests);
        })
        .catch((err) => {
          console.log(err, "navbar profile");
        });
    }
    fetchSelectData();
  }, []);
  useEffect(() => {
    LoadTests();
  }, [SampType]);
  console.log(SampType.value);
  const options = Types.map((item, index) => ({
    value: item.test_route,
    label: item.belongs,
  }));
  return (
    <div>
      <Typography
        component="h1"
        variant="h5"
        style={{ textAlign: "center", margin: "30px" }}
      >
        Tests Record
      </Typography>
      <Select
        id="manage-sample-select"
        value={SampType}
        onChange={HandleTypes}
        options={options}
        styles={customStyles}
      />
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
});

export default TestRecords;
