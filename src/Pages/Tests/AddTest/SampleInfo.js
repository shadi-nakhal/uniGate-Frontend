import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import style from "./style";
const comp3 = React.memo(({ formik, Selection }) => {
  const [Projects, setProjects] = useState([]);

  const getProjects = (e) => {
    setProjects([]);
    let value = e.target.value;
    if (value) {
      setProjects(
        Selection.clients.filter((client) => client.id === Number(value))[0]
          .projects
      );
    }
  };

  return (
    <fieldset>
      <legend style={{ margin: "2%" }}>Sample info :</legend>
      <div style={style.top}>
        <TextField
          style={style.TextField}
          name="date"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          type="date"
          id="date"
          label="Received Date"
          onChange={formik.handleChange}
          error={formik.touched.date && Boolean(formik.errors.date)}
          helperText={formik.touched.date && formik.errors.date}
          autoComplete="date"
          margin="dense"
        />
      </div>
      <div style={style.top}>
        {/* <TextField
          style={style.TextField}
          InputLabelProps={{
            shrink: true,
          }}
          name="ref"
          variant="outlined"
          id="ref"
          label="Reference"
          onChange={formik.handleChange}
          error={formik.touched.ref && Boolean(formik.errors.ref)}
          helperText={formik.touched.ref && formik.errors.ref}
          autoComplete="ref"
          margin="dense"
        /> */}
        <TextField
          style={style.TextField}
          name="client_ref"
          variant="outlined"
          id="client_ref"
          InputLabelProps={{
            shrink: true,
          }}
          label="Client's Reference"
          onChange={formik.handleChange}
          error={formik.touched.client_ref && Boolean(formik.errors.client_ref)}
          helperText={formik.touched.client_ref && formik.errors.client_ref}
          autoComplete="client_ref"
          margin="dense"
        />
      </div>
      <div style={style.top}>
        <TextField
          style={style.TextField}
          id="client_id"
          select
          onChange={(e) => {
            getProjects(e);
            formik.handleChange(e);
          }}
          name="client_id"
          SelectProps={{
            native: true,
          }}
          helperText="Client"
          margin="dense"
          error={formik.touched.client_id && Boolean(formik.errors.client_id)}
        >
          <option value=""></option>
          {Selection.clients.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            );
          })}
        </TextField>
        <TextField
          style={{
            ...style.TextField,
          }}
          id="project_id"
          select
          onChange={formik.handleChange}
          name="project_id"
          SelectProps={{
            native: true,
          }}
          helperText="Project"
          margin="dense"
          error={formik.touched.project_id && Boolean(formik.errors.project_id)}
        >
          <option value="None">None</option>
          {Projects.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            );
          })}
        </TextField>
      </div>
      <div style={style.top}>
        <TextField
          style={style.TextField}
          id="source"
          select
          onChange={(e) => {
            formik.handleChange(e);
          }}
          name="source"
          SelectProps={{
            native: true,
          }}
          helperText="Supplier"
          margin="dense"
          error={formik.touched.source && Boolean(formik.errors.source)}
        >
          <option value="None">None</option>
          {Selection.sources.map((option) => {
            return (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            );
          })}
        </TextField>
      </div>
      <div style={style.top}>
        <TextField
          style={style.TextField}
          InputLabelProps={{
            shrink: true,
          }}
          name="truck_number"
          variant="outlined"
          id="truck_number"
          label="Truck Number"
          onChange={formik.handleChange}
          error={
            formik.touched.truck_number && Boolean(formik.errors.truck_number)
          }
          helperText={formik.touched.truck_number && formik.errors.truck_number}
          autoComplete="truck_number"
          margin="dense"
        />
        <TextField
          style={style.TextField}
          name="ticket_number"
          variant="outlined"
          id="client_ref"
          InputLabelProps={{
            shrink: true,
          }}
          label="Ticket Number"
          onChange={formik.handleChange}
          error={
            formik.touched.ticket_number && Boolean(formik.errors.ticket_number)
          }
          helperText={
            formik.touched.ticket_number && formik.errors.ticket_number
          }
          autoComplete="ticket_number"
          margin="dense"
        />
      </div>
    </fieldset>
  );
});

export default comp3;
