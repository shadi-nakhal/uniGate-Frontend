import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import cookie from "../../Service/CookieService";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const classes = {
  paper: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: "1%",
    backgroundColor: "#009682",
    color: "#E0F5F2",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "1%",
  },
  submit: {
    marginTop: "5%",
    color: "#E0F5F2",
    backgroundColor: "#009682",
    fontWeight: "1000",
    fontSize: "16px",
  },
};

function Login() {
  const [display, setDisplay] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();
  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string("Enter your password")
      .min(6, "Password should be of minimum 6 characters length")
      .required("Password is required"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleSubmit(values);
    },
  });

  const HandleSubmit = ({ email, password }) => {
    axios
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        cookie.set("Bearer ", res.data.access_token, {
          Path: "/",
          maxAge: res.data.expires_in,
        });
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setMessage(
            Object.entries(error.response.data.error).map(
              (item) => " " + item[1] + " "
            )
          );
          setDisplay("inline");
        } else {
          setMessage("N e t w o r k  E r r o r");
          setDisplay("inline");
        }
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={classes.paper}>
        <Avatar style={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <span style={{ color: "red", display: display }}>{message}</span>
        <form onSubmit={formik.handleSubmit} style={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="black"
            style={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Login;
