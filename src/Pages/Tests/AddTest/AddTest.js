import React, { useState, useEffect, useContext, useCallback } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import * as yup from "yup";
import CookieService from "../../../Service/CookieService";
import { useHistory } from "react-router-dom";
import style from "./style";
import SampleAttributes from "./SampleAttributes";
import SampleInfo from "./SampleInfo";
import axios from "axios";
import UserContext from "../../../Service/UserContext";

function AddTest({ SampleData }) {
  const cookie = CookieService.get("Bearer");
  const { setUser, user } = useContext(UserContext);
  const history = useHistory();
  const [display, setDisplay] = useState({
    display: "none",
    margin: "10px",
    color: "Red",
  });
  const [message, setMessage] = useState("");
  const [SampData, setSampData] = useState(SampleData);

  const [Selection, setSelection] = useState({
    types: [],
    clients: [],
    grades: [],
    sources: [],
  });

  const [CheckType, setCheckType] = useState({
    type: true,
    project: true,
    mixDes: true,
    typeDes: true,
  });

  const CheckingType = useCallback((value) => {
    setCheckType({ ...CheckType, ...value });
  }, []);

  useEffect(() => {
    const fetchclients = async () => {
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
          setSelection(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchclients();
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
      formData.append("sample_id", SampleData.id);
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
      axios
        .post(CheckType.type ? "/concrete" : "/material", formData)
        .then((res) => {
          console.log(res);
          setMessage("Project has been added !");
          setDisplay({ display: "inline", margin: "10px", color: "green" });
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

  console.log(SampleData.type);
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
      // HandleSubmit(values);
      console.log(values);
    },
  });

  return (
    <div style={style.paperr}>
      <Typography style={style.title} component="h1" variant="h5">
        New Sample
      </Typography>
      {<span style={display}>{message}</span>}
      <form
        style={{ width: "60%", minWidth: "340px" }}
        onSubmit={formik.handleSubmit}
      >
        <SampleAttributes
          formik={formik}
          Selection={Selection}
          CheckingType={CheckingType}
        />
        {/* <SampleInfo formik={formik} Selection={Selection} /> */}

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
          <Button
            size="large"
            onClick={() => Handling(false)}
            variant="contained"
            color="primary"
            style={style.addbutton}
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddTest;
