import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as yup from "yup";
import CookieService from "../../Service/CookieService";
import { useHistory } from "react-router-dom";
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

function Register() {
  const cookie = CookieService.get("Bearer");
  const [display, setDisplay] = useState({
    display: "none",
    margin: "10px",
    color: "Red",
  });
  const [message, setMessage] = useState("");
  const [imgError, setImgError] = useState();
  const [imageValue, setImageValue] = useState();
  const [phoneValue, setphoneValue] = useState();
  const [roles, setRoles] = useState([]);
  const history = useHistory();

  const validationSchema = yup.object({
    firstname: yup
      .string()
      .max(10, "Must be 10 characters or less")
      .required("Firstname is required"),
    lastname: yup
      .string()
      .max(10, "Must be 10 characters or less")
      .required("Lastname is required"),
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string("Enter your password")
      .min(6, "Password should be of minimum 6 characters length")
      .required("Password is required"),
  });
  const HandleSubmit = ({
    email,
    password,
    firstname,
    lastname,
    role,
    ext,
  }) => {
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append(
      "mobile",
      phoneValue[0] === "+" ? phoneValue : "+" + phoneValue
    );
    formData.append("password", password);
    formData.append("image", imageValue);
    formData.append("role", role);
    formData.append("ext", ext);

    axios
      .post("/register", formData)
      .then((res) => {
        setMessage("User has been added !");
        setDisplay({ display: "inline", margin: "10px", color: "green" });
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

  useEffect(() => {
    const fetchroles = async () => {
      var config = {
        method: "get",
        url: "http://localhost:8000/api/roles",
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          setRoles(res.data);
        })
        .catch((err) => {
          console.log(err.request);
        });
    };
    fetchroles();
  }, [cookie]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phone: "",
      role: "Technician",
      ext: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleSubmit(values);
    },
  });
  console.log(phoneValue);
  return (
    <div style={style.paperr}>
      <Typography style={style.title} component="h1" variant="h5">
        New User
      </Typography>
      {<span style={display}>{message}</span>}
      <form onSubmit={formik.handleSubmit}>
        <div style={style.name}>
          <TextField
            style={{ marginRight: "15px", marginBottom: "10px" }}
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
              width: "39%",
            }}
            inputProps={{
              id: "phone",
              label: "Phone",
              name: "phone",
              required: true,
              autoFocus: true,
            }}
            masks={{ lb: ". ... ..." }}
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
        <div>
          <TextField
            style={{ marginBottom: "10px", width: "100px" }}
            variant="outlined"
            required
            id="ext"
            label="Ext"
            name="ext"
            value={formik.values.ext}
            onChange={formik.handleChange}
            error={formik.touched.ext && Boolean(formik.errors.ext)}
            helperText={formik.touched.ext && formik.errors.ext}
            autoComplete="ext"
            margin="dense"
            autoFocus
          />
        </div>

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
        <TextField
          style={{ marginBottom: "10px" }}
          variant="outlined"
          required
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          autoComplete="current-password"
          margin="dense"
        />
        <TextField
          style={{ marginBottom: "10px" }}
          id="role"
          select
          value={formik.values.role}
          onChange={formik.handleChange}
          name="role"
          SelectProps={{
            native: true,
          }}
          helperText="Please select Role"
          margin="dense"
        >
          {roles.map((option) => {
            return (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            );
          })}
        </TextField>
        <div>
          {imgError ? (
            <p style={{ color: "red" }}>Image max size is 2Mb</p>
          ) : null}
          <label for="image">Profile Picture</label>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="image"
            type="file"
            id="image"
            onChange={(event) => {
              if (event.target.files[0].size > 2048000) {
                setImgError(true);
              } else {
                setImgError(false);
                const file = event.target.files[0];
                setImageValue(file);
              }
            }}
          />
        </div>
        <div style={style.submitcontainer}>
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            style={style.submit}
          >
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Register;
