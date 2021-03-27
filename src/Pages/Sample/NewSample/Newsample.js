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

function NewsampleO() {
  const cookie = CookieService.get("Bearer");
  const { setUser, user } = useContext(UserContext);
  const history = useHistory();
  const [display, setDisplay] = useState({
    display: "none",
    margin: "10px",
    color: "Red",
  });
  const [message, setMessage] = useState("");
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
    date: yup.date().required("Recieved date is required"),
    client_ref: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .min(3, "Must be more than 3 characters")
      .required("Client's Ref is required"),
    client_id: yup.number().required("Client name is required"),
    project_id: yup.string().required("Project is required"),
    source: yup.string().required("source is required"),
    truck_number: yup
      .string()
      .max(20, "please check this number")
      .required("Truck number is required"),
    ticket_number: yup
      .string()
      .max(20, "please check ticket number")
      .required("Ticket number is required"),
    type: yup.string().required("Firstname is required"),
    type_description: yup.string().required("Type Description is required"),
    grade: CheckType.type
      ? yup.string("Select a Grade").required("Grade is required")
      : null,
    mix_description: CheckType.type
      ? yup.string().required("Mix Description is required")
      : null,
    cast_date: CheckType.type
      ? yup.date().required("Cast date is required")
      : null,
    test_date: !CheckType.type
      ? yup.date().required("Test date is required")
      : null,
    age: CheckType.type
      ? yup
          .number()
          .typeError("you must specify a number")
          .max(99, "Must be less than 99")
          .required("age is required")
      : null,
  });

  const HandleSubmit = useCallback(
    ({
      age,
      cast_date,
      client_id,
      client_ref,
      date,
      grade,
      mix_description,
      project_id,
      ref,
      source,
      ticket_number,
      truck_number,
      type,
      type_description,
      test_date,
    }) => {
      const formData = new FormData();
      formData.append("age", age);
      formData.append("cast_date", cast_date);
      formData.append("client_id", client_id);
      formData.append("client_ref", client_ref);
      formData.append("date", date);
      formData.append("grade", grade);
      formData.append("mix_description", mix_description);
      formData.append("project_id", project_id);
      formData.append("ref", ref);
      formData.append("source", source);
      formData.append("ticket_number", ticket_number);
      formData.append("truck_number", truck_number);
      formData.append("type", type);
      formData.append("type_description", type_description);
      formData.append("technician_id", user.user.id);
      formData.append("test_date", test_date);
      var config = {
        method: "post",
        url: CheckType.type ? "/concrete" : "/materials",
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData,
      };
      axios(config)
        .then((res) => {
          console.log(res);
          setMessage("Sample has been added !");
          setDisplay({ display: "inline", margin: "10px", color: "green" });
          history.push("/ManageSamples");
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
      date: "",
      project_id: "None",
      source: "",
      truck_number: "",
      ticket_number: "",
      client_ref: "",
      client_id: "",
      type: "",
      type_description: "None",
      grade: "",
      mix_description: "None",
      cast_date: "",
      test_date: "",
      age: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleSubmit(values);
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
        onChange={formik.sendData}
      >
        <SampleAttributes
          formik={formik}
          Selection={Selection}
          CheckingType={CheckingType}
        />
        <SampleInfo formik={formik} Selection={Selection} />

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

export default NewsampleO;
