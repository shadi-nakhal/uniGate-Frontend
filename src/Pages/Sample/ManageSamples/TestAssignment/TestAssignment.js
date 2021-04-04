import React, { useState, useContext, useEffect, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import UserContext from "../../../../Service/UserContext";
import Button from "@material-ui/core/Button";
import CookieService from "../../../../Service/CookieService";
import Typography from "@material-ui/core/Typography";
import style from "../../NewSample/style";
import Grid from "./Grid";
import axios from "axios";

const comp2 = React.memo(({ SampleData, HandleEdit }) => {
  const cookie = CookieService.get("Bearer");
  const { setUser, user } = useContext(UserContext);
  const [SelectData, setSelectData] = useState({ tests: [], users: [] });
  const [update, setUpdate] = useState(true);
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

  const HandleMessage = useCallback(
    (e) => {
      setMessage(e);
    },
    [message]
  );

  useEffect(() => {
    const fetchSelectData = async () => {
      var config = {
        method: "get",
        url: `/testselection/${SampleData.type}`,
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          setSelectData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchSelectData();
  }, [cookie]);
  const HandleUpdate = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const HandleSubmit = useCallback(({ test_name, technician_id }) => {
    const formData = new FormData();
    formData.append("test_name", test_name);
    formData.append("technician_id", technician_id);
    formData.append("sample_id", SampleData.id);
    formData.append("sample_type", SampleData.type);
    formData.append("sample_ref", SampleData.ref);
    formData.append("test_date", SampleData.test_date);
    formData.append("status", 0);
    console.log(SampleData.test_date);
    let config = {
      method: "post",
      url: "/task",
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
    };
    axios(config)
      .then((res) => {
        console.log(res);
        HandleUpdate();
        setMessage("Task has been created !");
        setDisplay({ display: "inline", margin: "10px", color: "green" });
        // history.push("/ManageProjects");
      })

      .catch((error) => {
        console.log(error);
        if (error.response.data.errors) {
          setMessage(
            Object.entries(error.response.data.errors).map(
              (item) => " " + item[1] + ","
            )
          );
          setDisplay({ display: "inline", margin: "10px", color: "Red" });
        } else {
          setMessage("N e t w o r k  E r r o r");
          setDisplay({ display: "inline", margin: "10px", color: "Red" });
        }
      });
  });
  console.log(SampleData);

  const validationSchema = yup.object({
    technician_id: yup.string().required(" Technician name is required"),
    test_name: yup.string().required("Test is required"),
  });

  const formik = useFormik({
    initialValues: {
      technician_id: user.user.role == "Head of lab" ? "" : user.user.id,
      test_name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleSubmit(values);
    },
  });

  return (
    <div>
      <div style={style.paperr}>
        <Typography
          component="h1"
          variant="h5"
          style={{ textAlign: "center", margin: "20px" }}
        >
          Assign Tests
        </Typography>
        {<span style={display}>{message}</span>}
      </div>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            ...style.top,
            display: "flex",
            flexDirection: "row",
            width: "80vw",
          }}
        >
          <TextField
            style={style.TextField}
            id="technician_id"
            select
            onChange={formik.handleChange}
            name="technician_id"
            value={formik.values.technician_id}
            SelectProps={{
              native: true,
            }}
            helperText="Assign to"
            margin="dense"
            error={
              formik.touched.technician_id &&
              Boolean(formik.errors.technician_id)
            }
          >
            <option value={user.user.role == "Head of lab" ? "" : user.user.id}>
              {user.user.role == "Head of lab"
                ? ""
                : user.user.firstname + " " + user.user.lastname}
            </option>
            {user.user.role == "Head of lab"
              ? SelectData.users.map((option) => {
                  return (
                    <option key={option.id} value={option.id}>
                      {option.firstname + " " + option.lastname}
                    </option>
                  );
                })
              : null}
          </TextField>
          <TextField
            style={style.TextField}
            id="test_name"
            select
            onChange={formik.handleChange}
            name="test_name"
            value={formik.values.test_name}
            SelectProps={{
              native: true,
            }}
            helperText="Test"
            margin="dense"
            error={formik.touched.test_name && Boolean(formik.errors.test_name)}
          >
            <option value=""></option>
            {SelectData.tests.map((option) => {
              return (
                <option key={option.id} value={option.test_name}>
                  {option.test_name}
                </option>
              );
            })}
          </TextField>
          <div
            style={{
              ...style.submitcontainer,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "15%",
            }}
          >
            <Button
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              style={style.addbutton}
            >
              Assign
            </Button>
            <Button
              size="large"
              onClick={() => HandleEdit(false)}
              variant="contained"
              color="primary"
              style={style.addbutton}
            >
              Back
            </Button>
          </div>
        </div>
      </form>
      <div>
        <Grid
          update={update}
          SampleData={SampleData}
          HandleDisplay={HandleDisplay}
          HandleMessage={HandleMessage}
        />
      </div>
    </div>
  );
});

export default comp2;
