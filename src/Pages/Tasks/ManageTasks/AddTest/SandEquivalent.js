import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import style from "./style";
const CompressiveTest = React.memo(({ formik, Fractures }) => {
  return (
    <fieldset>
      <legend style={{ margin: "1%" }}>Sample attributes :</legend>
      <div style={style.top}>
        <TextField
          style={{
            width: "25%",
            marginTop: "15px",
          }}
          InputLabelProps={{
            shrink: true,
          }}
          name="sand_reading"
          variant="outlined"
          id="sand_reading"
          label="Sand reading"
          onChange={formik.handleChange}
          error={
            formik.touched.sand_reading && Boolean(formik.errors.sand_reading)
          }
          helperText={formik.touched.sand_reading && formik.errors.sand_reading}
          autoComplete="sand_reading"
          margin="dense"
        />

        <TextField
          style={{
            width: "25%",
            marginTop: "15px",
          }}
          InputLabelProps={{
            shrink: true,
          }}
          name="sand_reading2"
          variant="outlined"
          id="sand_reading2"
          label="Sand reading 2"
          onChange={formik.handleChange}
          error={
            formik.touched.sand_reading2 && Boolean(formik.errors.sand_reading2)
          }
          helperText={
            formik.touched.sand_reading2 && formik.errors.sand_reading2
          }
          autoComplete="sand_reading2"
          margin="dense"
        />
      </div>
      <div style={style.top}>
        <TextField
          style={{
            width: "25%",
            marginTop: "15px",
          }}
          InputLabelProps={{
            shrink: true,
          }}
          name="clay_reading"
          variant="outlined"
          id="clay_reading"
          label="Clay reading"
          onChange={formik.handleChange}
          error={
            formik.touched.clay_reading && Boolean(formik.errors.clay_reading)
          }
          helperText={formik.touched.clay_reading && formik.errors.clay_reading}
          autoComplete="clay_reading"
          margin="dense"
        />
        <TextField
          style={{
            width: "25%",
            marginTop: "15px",
          }}
          InputLabelProps={{
            shrink: true,
          }}
          name="clay_reading2"
          variant="outlined"
          id="clay_reading2"
          label="Clay reading 2"
          onChange={formik.handleChange}
          error={
            formik.touched.clay_reading2 && Boolean(formik.errors.clay_reading2)
          }
          helperText={
            formik.touched.clay_reading2 && formik.errors.clay_reading2
          }
          autoComplete="clay_reading2"
          margin="dense"
        />
      </div>
      <div style={style.top}>
        <TextField
          type="time"
          style={{
            width: "30%",
            marginTop: "15px",
          }}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          name="time"
          variant="outlined"
          defaultValue="07:30"
          id="time"
          label="Time"
          onChange={formik.handleChange}
          error={formik.touched.time && Boolean(formik.errors.time)}
          helperText={formik.touched.time && formik.errors.time}
          autoComplete="time"
          margin="dense"
        />
      </div>
    </fieldset>
  );
});

export default CompressiveTest;
