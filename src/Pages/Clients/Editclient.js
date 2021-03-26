import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as yup from "yup";
// import CookieService from "../../Service/CookieService";
import axios from "axios";

const style = {
  paperr: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  name: {
    display: "flex",
    flexDirection: "row",
  },

  title: {
    marginBottom: "1%",
    marginTop: "2%",
  },
  submitcontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "2%",
  },
  submit: {
    color: "#E0F5F2",
    backgroundColor: "#009682",
    fontWeight: "1000",
    fontSize: "16px",
  },
};

function Editclient({ ClientData, HandleEdit }) {
  // const cookie = CookieService.get("Bearer");
  const [display, setDisplay] = useState({
    display: "none",
    margin: "10px",
    color: "Red",
  });
  const [message, setMessage] = useState("");
  const [phoneValue, setphoneValue] = useState(ClientData.phone);
  const validationSchema = yup.object({
    firstname: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .required("Firstname is required"),
    lastname: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .required("Lastname is required"),
    address: yup
      .string()
      .max(100, "Must be 30 characters or less")
      .required("Address is required"),
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const HandleSubmit = ({ email, firstname, lastname, address }) => {
    const formData = new FormData();
    formData.append("name", firstname + " " + lastname);
    if (email !== ClientData.email) {
      formData.append("email", email);
    }
    formData.append("address", address);
    formData.append(
      "phone",
      phoneValue[0] === "+" ? phoneValue : "+" + phoneValue
    );

    axios
      .post(`/client/${ClientData.id}/?_method=put`, formData)
      .then((res) => {
        console.log(res);
        setMessage("Client info has been updated !");
        setDisplay({ display: "inline", margin: "10px", color: "green" });
        HandleEdit();
      })
      .catch((error) => {
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

  const formik = useFormik({
    initialValues: {
      firstname: ClientData.name.split(" ")[0],
      lastname: ClientData.name.split(" ")[1],
      address: ClientData.address,
      email: ClientData.email,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleSubmit(values);
    },
  });

  return (
    <div style={style.paperr}>
      <Typography style={style.title} component="h1" variant="h5">
        Update Client Info
      </Typography>
      {<span style={display}>{message}</span>}
      <form onSubmit={formik.handleSubmit}>
        <div style={style.name}>
          <TextField
            style={{ marginRight: "15px", marginBottom: "20px" }}
            name="firstname"
            variant="outlined"
            required
            id="firstname"
            label="First Name"
            value={formik.values.firstname}
            onChange={formik.handleChange}
            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
            helperText={formik.touched.firstname && formik.errors.firstname}
            autoComplete="firstname"
            margin="dense"
            autoFocus
          />
          <TextField
            style={{ marginLeft: "15px" }}
            variant="outlined"
            required
            id="lastname"
            label="Last Name"
            name="lastname"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            error={formik.touched.lastname && Boolean(formik.errors.lastname)}
            helperText={formik.touched.lastname && formik.errors.lastname}
            autoComplete="lastname"
            margin="dense"
          />
        </div>
        <div>
          <PhoneInput
            inputStyle={{
              backgroundColor: "#C3E0DC",
              borderColor: "#9CB3B0",
              width: "47%",
            }}
            inputProps={{
              id: "phone",
              label: "Phone",
              name: "phone",
              required: true,
              autoFocus: true,
            }}
            masks={{ lb: ". ... ..." }}
            value={ClientData.phone}
            country={"lb"}
            variant="outlined"
            defaultCountry="lb"
            onChange={(phone) => setphoneValue(phone)}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            autoComplete="mobile"
            margin="dense"
            autoFocus
          />
        </div>

        <TextField
          style={{ marginBottom: "10px", marginTop: "20px" }}
          variant="outlined"
          fullWidth
          required
          id="address"
          label="Address"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
          autoComplete="address"
          margin="dense"
        />

        <TextField
          style={{ marginBottom: "10px" }}
          fullWidth
          variant="outlined"
          required
          id="email"
          label="Email Address"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          autoComplete="email"
          margin="dense"
          autoFocus
        />

        <div style={style.submitcontainer}>
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            style={style.submit}
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Editclient;
