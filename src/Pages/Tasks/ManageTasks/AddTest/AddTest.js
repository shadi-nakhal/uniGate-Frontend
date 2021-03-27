import React, { useState, useEffect, useContext, useCallback } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import * as yup from "yup";
import CookieService from "../../../../Service/CookieService";
import { useHistory } from "react-router-dom";
import style from "./style";
import SandEquivalent from "./SandEquivalent";
import CompressiveTest from "./CompressiveTest";
import axios from "axios";
import UserContext from "../../../../Service/UserContext";

function AddTest({ HandleData }) {
  const cookie = CookieService.get("Bearer");
  const { setUser, user } = useContext(UserContext);
  const history = useHistory();
  const [display, setDisplay] = useState({
    display: "none",
    margin: "10px",
    color: "Red",
  });
  const [message, setMessage] = useState("");
  const [SampData, setSampData] = useState(HandleData);

  const [Fractures, setFractures] = useState([]);

  const [CheckType, setCheckType] = useState({
    type: true,
    project: true,
    mixDes: true,
    typeDes: true,
  });

  useEffect(() => {
    const fetchtype = async () => {
      let type = HandleData.sample_type;
      var config = {
        method: "get",
        url: `/addtestselection/${type}`,
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          if (res.data.belongs === "Concrete") {
            setCheckType({ ...CheckType, type: true });
          } else {
            setCheckType({ ...CheckType, type: false });
          }
          setFractures(res.data.fractures);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchtype();
  }, [cookie]);

  const validationSchema = yup.object({
    weight: CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .min(10000, "Minimum 10000")
          .max(20000, "Maximum 20000")
          .required("Weight is required")
      : null,
    length: CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .min(290, "Minimum 289")
          .max(310, "Maximum 310")
          .required("Length is required")
      : null,
    diameter: CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .min(145, "Minimum 145")
          .max(160, "Maximum 160")
          .required("Diameter is required")
      : null,
    load: CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .min(0, "Minimum 0")
          .max(3000, "Maximum 3000")
          .required("Diameter is required")
      : null,
    fracture: CheckType.type
      ? yup.string().required("Fracture is required")
      : null,
    time: !CheckType.type ? yup.string().required("Time is required") : null,
    sand_reading: !CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .min(8.0, "Minimum 8.0")
          .max(20.0, "Maximum 20.0")
          .required("Sand Reading is required")
      : null,
    sand_reading2: !CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .min(8.0, "Minimum 8.0")
          .max(20.0, "Maximum 20.0")
          .required("Sand Reading 2 is required")
      : null,
    clay_reading: !CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .min(8.0, "Minimum 8.0")
          .max(20.0, "Maximum 20.0")
          .required("Clay Reading is required")
      : null,
    clay_reading2: !CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .min(8.0, "Minimum 8.0")
          .max(20.0, "Maximum 20.0")
          .required("Clay Reading 2 is required")
      : null,
  });

  const HandleTask = async (id) => {
    const formData = new FormData();
    console.log(id);
    formData.append("status", 1);
    var config = {
      method: "post",
      url: `/task/${id}?_method=PUT`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
    };
    await axios(config)
      .then((res) => {
        console.log(res);
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
  };

  const HandleSubmit = useCallback(
    ({
      weight,
      length,
      diameter,
      load,
      fracture,
      time,
      sand_reading,
      sand_reading2,
      clay_reading,
      clay_reading2,
    }) => {
      const formData = new FormData();
      formData.append("sample_id", SampData.sample_id);
      formData.append("weight", weight);
      formData.append("length", length);
      formData.append("diameter", diameter);
      formData.append("load", load);
      formData.append("fracture", fracture);
      formData.append("time", time);
      formData.append("sand_reading", sand_reading);
      formData.append("sand_reading2", sand_reading2);
      formData.append("clay_reading", clay_reading);
      formData.append("clay_reading2", clay_reading2);
      formData.append("technician_id", user.user.id);
      var config = {
        method: "post",
        url: CheckType.type ? "/compressive" : "/sand",
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData,
      };
      axios(config)
        .then((res) => {
          console.log(res);
          setMessage("Test has been added !");
          setDisplay({ display: "inline", margin: "10px", color: "green" });
          HandleTask(SampData.id);
          // history.push("/ManageSamples");
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
    }
  );

  const formik = useFormik({
    initialValues: {
      weight: "",
      length: "",
      diameter: "",
      load: "",
      volume: "",
      fracture: "",
      time: "",
      sand_reading: "",
      sand_reading2: "",
      clay_reading: "",
      clay_reading2: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleSubmit(values);
    },
  });

  const TestSwitch = () => {
    switch (HandleData.test_name) {
      case "Compressive Strength":
        return <CompressiveTest formik={formik} Fractures={Fractures} />;
      case "Sand Equivalent":
        return <SandEquivalent formik={formik} />;
      default:
        return history.push("/ManageTasks");
    }
  };

  return (
    <div style={style.paperr}>
      <Typography style={style.title} component="h1" variant="h5">
        {HandleData.test_name}
      </Typography>
      {<span style={display}>{message}</span>}
      <form
        style={{ width: "60%", minWidth: "500px", margin: "10%" }}
        onSubmit={formik.handleSubmit}
      >
        {TestSwitch()}
        <div style={style.submitcontainer}>
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            style={style.submit}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddTest;
