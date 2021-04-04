import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as yup from "yup";
import CookieService from "../../Service/CookieService";
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

function EditProject({ ProjectData, HandleEdit }) {
  const cookie = CookieService.get("Bearer");
  const [display, setDisplay] = useState({
    display: "none",
    margin: "10px",
    color: "Red",
  });
  const [message, setMessage] = useState("");
  const [engineer_phone, setEngineer_phone] = useState(
    ProjectData.engineer_phone
  );
  const [contact_phone, setContact_phone] = useState(ProjectData.contact_phone);
  const [Clients, setClients] = useState([]);

  useEffect(() => {
    const fetchclients = async () => {
      var config = {
        method: "get",
        url: "/clients",
        headers: {
          Authorization: `Bearer ${cookie}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      await axios(config)
        .then((res) => {
          setClients(res.data);
        })
        .catch((err) => {
          console.log(err.request);
        });
    };
    fetchclients();
  }, [cookie]);

  const validationSchema = yup.object({
    name: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .min(2, "Must be more than 2 characters ")
      .required("Project Name is required"),
    location: yup
      .string()
      .max(100, "Must be 100 characters or less")
      .min(2, "Must be more than 2 characters ")
      .required("Location is required"),
    engineer_firstname: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .min(2, "Must be more than 2 characters")
      .required("Address is required"),
    engineer_lastname: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .required("Address is required"),
    engineer_email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    contact_firstname: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .required("Firstname is required"),
    contact_lastname: yup
      .string()
      .max(20, "Must be 20 characters or less")
      .required("Firstname is required"),
    contact_email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const HandleSubmit = ({
    name,
    location,
    engineer_firstname,
    engineer_lastname,
    engineer_email,
    contact_firstname,
    contact_lastname,
    contact_email,
    client_id,
  }) => {
    console.log(ProjectData.name);
    const formData = new FormData();
    if (name !== ProjectData.name) {
      formData.append("name", name);
    }
    formData.append("location", location);
    formData.append("engineer_firstname", engineer_firstname);
    formData.append("engineer_lastname", engineer_lastname);

    if (engineer_email !== ProjectData.engineer_email) {
      formData.append("engineer_email", engineer_email);
    }
    formData.append("contact_firstname", contact_firstname);
    formData.append("contact_lastname", contact_lastname);

    if (contact_email !== ProjectData.contact_email) {
      formData.append("contact_email", contact_email);
    }
    formData.append(
      "engineer_phone",
      engineer_phone[0] === "+" ? engineer_phone : "+" + engineer_phone
    );
    formData.append(
      "contact_phone",
      contact_phone[0] === "+" ? contact_phone : "+" + contact_phone
    );
    formData.append("client_id", client_id);
    var config = {
      method: "post",
      url: `/project/${ProjectData.id}/?_method=put`,
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
    };

    axios(config)
      .then((res) => {
        console.log(res);
        setMessage("Project has been Modified !");
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
      name: ProjectData.name,
      location: ProjectData.location,
      engineer_firstname: ProjectData.engineer_firstname,
      engineer_lastname: ProjectData.engineer_lastname,
      engineer_email: ProjectData.engineer_email,
      contact_firstname: ProjectData.contact_firstname,
      contact_lastname: ProjectData.contact_lastname,
      contact_email: ProjectData.contact_email,
      client_id: ProjectData.client_id,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      HandleSubmit(values);
      // console.log(values);
    },
  });

  return (
    <div style={style.paperr}>
      <Typography style={style.title} component="h1" variant="h5">
        Edit Project
      </Typography>
      {<span style={display}>{message}</span>}
      <form onSubmit={formik.handleSubmit}>
        <fieldset>
          <legend style={{ margin: "2%" }}>Project :</legend>
          <div style={style.name}>
            <TextField
              style={{ marginRight: "15px", marginBottom: "20px" }}
              name="name"
              variant="outlined"
              required
              id="name"
              label="Project Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              autoComplete="name"
              margin="dense"
              autoFocus
            />
          </div>
          <div>
            <TextField
              style={{ marginBottom: "10px" }}
              id="Client"
              select
              onChange={formik.handleChange}
              name="client_id"
              value={formik.values.client_id}
              SelectProps={{
                native: true,
              }}
              helperText="Client name"
              margin="dense"
            >
              <option value=""></option>
              {Clients.map((option) => {
                return (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                );
              })}
            </TextField>
          </div>
          <div style={style.name}>
            <TextField
              fullWidth
              style={{ marginRight: "15px", marginBottom: "20px" }}
              name="location"
              variant="outlined"
              required
              id="name"
              label="Project Address"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              autoComplete="location"
              margin="dense"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend style={{ margin: "2%" }}>Site Engineer info :</legend>
          <div style={style.name}>
            <TextField
              style={{
                marginRight: "15px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
              name="engineer_firstname"
              variant="outlined"
              required
              id="engineer_firstname"
              label="Site Engineer First Name"
              value={formik.values.engineer_firstname}
              onChange={formik.handleChange}
              error={
                formik.touched.engineer_firstname &&
                Boolean(formik.errors.engineer_firstname)
              }
              helperText={
                formik.touched.engineer_firstname &&
                formik.errors.engineer_firstname
              }
              autoComplete="engineer_firstname"
              margin="dense"
            />
            <TextField
              style={{
                marginRight: "15px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
              name="engineer_lastname"
              variant="outlined"
              required
              id="engineer_lastname"
              label="Site Engineer Last Name"
              value={formik.values.engineer_lastname}
              onChange={formik.handleChange}
              error={
                formik.touched.engineer_lastname &&
                Boolean(formik.errors.engineer_lastname)
              }
              helperText={
                formik.touched.engineer_lastname &&
                formik.errors.engineer_lastname
              }
              autoComplete="engineer_lastname"
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
                id: "engineer_phone",
                label: "Site Engineer Phone",
                name: "engineer_phone",
                required: true,
              }}
              style={{ marginBottom: "10px" }}
              masks={{ lb: ". ... ..." }}
              country={"lb"}
              variant="outlined"
              defaultCountry="lb"
              value={ProjectData.engineer_phone}
              onChange={(phone) => setEngineer_phone(phone)}
              error={
                formik.touched.engineer_phone &&
                Boolean(formik.errors.engineer_phone)
              }
              helperText={
                formik.touched.engineer_phone && formik.errors.engineer_phone
              }
              autoComplete="engineer_phone"
              margin="dense"
            />

            <TextField
              style={{ marginBottom: "20px" }}
              fullWidth
              variant="outlined"
              required
              id="engineer_email"
              label="Site Engineer Email"
              name="engineer_email"
              value={formik.values.engineer_email}
              onChange={formik.handleChange}
              error={
                formik.touched.engineer_email &&
                Boolean(formik.errors.engineer_email)
              }
              helperText={
                formik.touched.engineer_email && formik.errors.engineer_email
              }
              autoComplete="engineer_email"
              margin="dense"
            />
          </div>
        </fieldset>
        <fieldset>
          <legend style={{ margin: "5%" }}>Site Contact info :</legend>
          <div style={style.name}>
            <TextField
              style={{
                marginRight: "15px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
              name="contact_firstname"
              variant="outlined"
              required
              id="contact_firstname"
              label="Site Contact First Name"
              value={formik.values.contact_firstname}
              onChange={formik.handleChange}
              error={
                formik.touched.contact_firstname &&
                Boolean(formik.errors.contact_firstname)
              }
              helperText={
                formik.touched.contact_firstname &&
                formik.errors.contact_firstname
              }
              autoComplete="contact_firstname"
              margin="dense"
            />
            <TextField
              style={{
                marginRight: "15px",
                marginBottom: "20px",
                marginTop: "20px",
              }}
              name="contact_lastname"
              variant="outlined"
              required
              id="contact_lastname"
              label="Site Contact Last Name"
              value={formik.values.contact_lastname}
              onChange={formik.handleChange}
              error={
                formik.touched.contact_lastname &&
                Boolean(formik.errors.contact_lastname)
              }
              helperText={
                formik.touched.contact_lastname &&
                formik.errors.contact_lastname
              }
              autoComplete="contact_lastname"
              margin="dense"
            />
          </div>
          <PhoneInput
            inputStyle={{
              backgroundColor: "#C3E0DC",
              borderColor: "#9CB3B0",
              width: "47%",
            }}
            inputProps={{
              id: "contact_phone",
              label: "Site Contact Phone",
              name: "contact_phone",
              required: true,
            }}
            style={{ marginBottom: "10px" }}
            masks={{ lb: ". ... ..." }}
            country={"lb"}
            variant="outlined"
            defaultCountry="lb"
            value={ProjectData.contact_phone}
            onChange={(phone) => setContact_phone(phone)}
            error={
              formik.touched.engineer_phone &&
              Boolean(formik.errors.contact_phone)
            }
            helperText={
              formik.touched.contact_phone && formik.errors.contact_phone
            }
            autoComplete="contact_phone"
            margin="dense"
          />
          <TextField
            style={{ marginBottom: "10px" }}
            fullWidth
            variant="outlined"
            required
            id="contact_email"
            label="Site Contact Email"
            name="contact_email"
            value={formik.values.contact_email}
            onChange={formik.handleChange}
            error={
              formik.touched.contact_email &&
              Boolean(formik.errors.contact_email)
            }
            helperText={
              formik.touched.contact_email && formik.errors.contact_email
            }
            autoComplete="contact_email"
            margin="dense"
          />
        </fieldset>
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

export default EditProject;
