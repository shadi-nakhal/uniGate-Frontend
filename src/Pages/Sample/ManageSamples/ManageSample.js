import React, { useState, useEffect, useMemo, useCallback } from "react";
import { XGrid } from "@material-ui/x-grid";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import CookieService from "../../../Service/CookieService";
import NativeSelect from "@material-ui/core/NativeSelect";
import TestAssignment from "./TestAssignment/TestAssignment";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import Select from "react-select";

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#C3E0DC",
    width: 300,
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
  }),
  control: () => ({
    display: "flex",
    width: 300,
    border: "1px solid black",
    color: "black",
  }),
};

function ManageSample({ update }) {
  const [Samples, setSamples] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Editing, setEditing] = useState(false);
  const [SampleData, setSampleData] = useState({});
  const [SampType, setSampType] = useState({
    value: "materials",
    label: "materials",
  });
  const [Types, setTypes] = useState([]);
  const [total, settotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const url = `?page=${pageNumber}`;
  const useStyles = makeStyles((theme) => ({
    SamplesTable: {
      zIndex: "0",
      height: "72vh",
      scroll: "none",
      width: "100%",
    },
    title: {
      marginTop: "1%",
      textAlign: "center",
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
      height: "100%",
    },
  }));
  const SamplesTable = useStyles();
  const cookie = CookieService.get("Bearer");

  useEffect(() => {
    async function LoadSamplesType() {
      var config = {
        method: "get",
        url: "/selection",
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          setTypes(
            res.data.types
              .map((samp) => samp.belongs)
              .filter((value, index, self) => self.indexOf(value) === index)
          );
        })
        .catch((err) => {
          console.log(err, "navbar profile");
        });
    }
    LoadSamplesType();
  }, []);

  const HandleTypes = useCallback(
    (e) => {
      setSampType({ value: e.value.toLowerCase(), label: e.label });
    },
    [SampType]
  );

  const HandleEdit = useCallback((value) => {
    setEditing(value);
  }, []);

  const loadSamples = async () => {
    setLoading(true);
    setSamples([]);
    var config = {
      method: "get",
      url: `/${SampType.value}` + url,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        settotal(res.data.total);
        setSamples(
          res.data.data.map((item, index) => {
            return {
              ...item,
              delete: { id: item.id },
              edit: { id: item.id, index: index },
              added_by:
                item.technician.firstname + " " + item.technician.lastname,
              client_id: item.client.name,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err.request);
      });
    setLoading(false);
  };

  const DeleteSample = async (id) => {
    var config = {
      method: "Delete",
      url: `/${SampType}/${id}`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        setSamples(
          res.data.data.map((item, index) => {
            return {
              ...item,
              delete: { id: item.id },
              assign: { id: item.id, index: index },
              added_by:
                item.technician.firstname + " " + item.technician.lastname,
              client_id: item.client.name,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadSamples();
  }, [SampType, pageNumber, Editing]);
  console.log(SampType);

  const columns = useMemo(() => [
    {
      field: "assign",
      headerName: "Assign",
      renderCell: (params) => (
        <Button
          style={{ backgroundColor: "#36C14B" }}
          variant="contained"
          size="small"
          alt="Remy Sharp"
          onClick={() => {
            setSampleData(params.row);
            setEditing(true);
          }}
        >
          Assign
        </Button>
      ),
    },

    // {
    //   field: "edit",
    //   headerName: "Edit",
    //   renderCell: (params) => (
    //     <Button
    //       style={{ backgroundColor: "#36C14B" }}
    //       variant="contained"
    //       size="small"
    //       alt="Remy Sharp"
    //       onClick={() => {
    //         // console.log(Samples[params.value.index]);
    //         setSampleData(Samples[params.value.index]);
    //         setEditing(true);
    //       }}
    //     >
    //       Edit
    //     </Button>
    //   ),
    // },

    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => DeleteSample(params.value.id)}
          style={{ backgroundColor: "#F76363" }}
          variant="contained"
          size="small"
          alt="Remy Sharp"
        >
          Delete
        </Button>
      ),
    },
    { field: "id", headerName: "ID", width: 65 },
    { field: "ref", headerName: "Reference", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Chip
          label="UnAssigned"
          size="small"
          style={{ backgroundColor: "#E2F43F", color: "#3C5B55" }}
        />
      ),
      // style={{ backgroundColor: "#50DD21", color: "#3C5B55" }}
    },
    {
      field: "tests-assigned",
      headerName: "Tests-Assigned",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <NativeSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          className={SamplesTable.selectEmpty}
          value={0}
        >
          <option>Compression blabla Test - Shadi nakhal - pending</option>
          {/* {params.value.map((item, index) => {
            return (
              <option id="projects-list" key={index} value={index}>
                {item.name}
              </option>
            );
          })} */}
        </NativeSelect>
      ),
    },
    { field: "type", headerName: "Sample Type", width: 180 },
    { field: "type_description", headerName: "Description", width: 170 },
    { field: "test_date", headerName: "Test Date", width: 200 },
    { field: "date", headerName: "Recieved Date", width: 200 },
    { field: "client_ref", headerName: "Client's Ref", width: 200 },
    { field: "source", headerName: "Supplier", width: 200 },
    { field: "truck_number", headerName: "Truck's number", width: 200 },
    { field: "ticket_number", headerName: "Ticket's number", width: 200 },
    { field: "client_id", headerName: "Client", width: 200 },
    {
      field: "added_by",
      headerName: "Added by",
      width: 200,
      valueGetter: (params) => `${params.row.added_by}`,
    },
  ]);

  if (SampType == "concrete") {
    let con = [
      { field: "cast_date", headerName: "Cast Date", width: 150 },
      { field: "age", headerName: "Age", width: 100 },
      { field: "grade", headerName: "Grade", width: 100 },
      { field: "mix_description", headerName: "Mix Description", width: 180 },
    ];

    columns.splice(6, 0, ...con);
  }

  const options = Types.map((item, index) => ({ value: item, label: item }));

  if (Editing) {
    return (
      <div>
        <TestAssignment
          SampleData={SampleData}
          HandleEdit={HandleEdit}
          update={update}
        />
      </div>
    );
  } else {
    return (
      <div>
        <Typography className={SamplesTable.title} component="h1" variant="h5">
          Samples Manager
        </Typography>
        {/* <NativeSelect
          value={SampType}
          style={{ width: "200px", marginLeft: "20px", marginBottom: "20px" }}
          labelId="manage-sample-select"
          onChange={(e) => HandleTypes(e)}
        >
          {Types.map((item, index) => {
            return (
              <option id="projects-list" key={index} value={item}>
                {item}
              </option>
            );
          })}
        </NativeSelect> */}
        <Select
          id="manage-sample-select"
          value={SampType}
          onChange={HandleTypes}
          options={options}
          styles={customStyles}
        />
        <div className={SamplesTable.SamplesTable}>
          <XGrid
            pagination
            paginationMode="server"
            onPageChange={(params) => {
              console.log(params.page);
              setPageNumber(params.page + 1);
            }}
            rows={Samples}
            columns={columns}
            rowCount={total}
            pageSize={10}
            rowHeight={25}
          />
        </div>
      </div>
    );
  }
}

export default ManageSample;
