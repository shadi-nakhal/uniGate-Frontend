import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { XGrid } from "@material-ui/x-grid";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import CookieService from "../../../Service/CookieService";
import NativeSelect from "@material-ui/core/NativeSelect";
import TestAssignment from "./TestAssignment/TestAssignment";
import Typography from "@material-ui/core/Typography";
import UserContext from "../../../Service/UserContext";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import Select from "react-select";
import AlertDialog from "./confirmation";

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
  const { setUser, user } = useContext(UserContext);
  const [Samples, setSamples] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Editing, setEditing] = useState(false);
  const [SampleData, setSampleData] = useState({});
  const [SampType, setSampType] = useState({
    value: "materials",
    label: "Materials",
  });
  const [Types, setTypes] = useState([]);
  const [meta, setmeta] = useState(0);
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
      marginTop: "2%",
      textAlign: "center",
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
      height: "100%",
    },
  }));
  const SamplesTable = useStyles();
  const cookie = CookieService.get("Bearer");
  const [Dialog, setDialog] = useState(false);
  const [delId, setdelId] = useState("");

  const [message, setMessage] = useState("");
  const [display, setDisplay] = useState({
    display: "none",
    margin: "10px",
    color: "Red",
  });

  const HandleDisplay = useCallback(
    (e) => {
      setDisplay(e);
    },
    [display]
  );

  const handleClickOpen = (id) => {
    setDialog(true);
    setdelId(id);
  };

  const handleClose = () => {
    setDialog(false);
    setdelId("");
  };

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
        setmeta(res.data.meta);
        setSamples(
          res.data.data.map((item, index) => {
            return {
              ...item,
              delete: { id: item.id },
              assign: { id: item.id, index: index },
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
    var config = {
      method: "Delete",
      url: `/${SampType.value}/${delId}`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios(config)
      .then((res) => {
        setmeta(res.data.meta);
        setDisplay({
          display: "none",
          margin: "10px",
          color: "Red",
        });
        setSamples(
          res.data.data.map((item, index) => {
            return {
              ...item,
              delete: { id: item.id },
              assign: { id: item.id, index: index },
            };
          })
        );
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.errors) {
          setMessage(
            Object.entries(error.response.data.errors).map(
              (item) => " " + item[1] + ","
            )
          );
          setDisplay({
            display: "inline",
            margin: "10px",
            color: "Red",
          });
        } else {
          setMessage("N e t w o r k  E r r o r");
          setDisplay({ display: "inline", margin: "10px", color: "Red" });
        }
      });
  };

  useEffect(() => {
    loadSamples();
  }, [SampType, pageNumber, Editing]);

  const columns = useMemo(() => [
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

    { field: "id", headerName: "ID", width: 65 },
    { field: "ref", headerName: "Reference", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        let state = params.row.status;
        const colors = () => {
          switch (state) {
            case "Warning":
              return "#E2F43F";
            case "Completed":
              return "green";
            case "Pending":
              return "blue";
            case "Over due":
              return "red";
          }
        };
        return (
          <Chip
            label={params.row.status}
            size="small"
            style={{
              backgroundColor: colors(),
              color: "black",
              width: "100px",
            }}
          />
        );
      },
      // style={{ backgroundColor: "#50DD21", color: "#3C5B55" }}
    },
    {
      field: "tests-assigned",
      headerName: "Tests-Assigned",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <NativeSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          className={SamplesTable.selectEmpty}
          value={0}
          style={{ width: "100%" }}
        >
          {params.row.tasks.map((item, index) => {
            return (
              <option id="projects-list" key={index} value={index}>
                {item.test_name}
              </option>
            );
          })}
        </NativeSelect>
      ),
    },
    { field: "type", headerName: "Sample Type", width: 180 },
    { field: "type_description", headerName: "Description", width: 170 },
    { field: "test_date", headerName: "Test Date", width: 200 },
    { field: "date", headerName: "Recieved Date", width: 200 },
    { field: "client_ref", headerName: "Client's Ref", width: 200 },
    { field: "source", headerName: "Supplier", width: 200 },
    { field: "truck_number", headerName: "Truck number", width: 200 },
    { field: "ticket_number", headerName: "Ticket number", width: 200 },
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
  if (user.user.role == "Head of lab") {
    let con = [
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

    columns.splice(0, 0, ...con);
  }

  if (user.user.role == "Head of lab" || user.user.role == "Technician") {
    let con = [
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
    ];

    columns.splice(0, 0, ...con);
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
        <div style={{ textAlign: "center" }}>
          {<span style={display}>{message}</span>}
        </div>
        <Select
          id="manage-sample-select"
          value={SampType}
          onChange={HandleTypes}
          options={options}
          styles={customStyles}
        />
        <AlertDialog
          handleClose={handleClose}
          Delete={Delete}
          Dialog={Dialog}
        />
        <div className={SamplesTable.SamplesTable}>
          <XGrid
            pagination
            paginationMode="server"
            onPageChange={(params) => {
              setPageNumber(params.page + 1);
            }}
            rows={Samples}
            columns={columns}
            rowCount={meta.total}
            pageSize={10}
            rowHeight={30}
          />
        </div>
      </div>
    );
  }
}

export default ManageSample;
