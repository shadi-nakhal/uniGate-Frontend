import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import style from "./style";
const SandEquivalent = React.memo(({ formik, Fractures }) => {
  return (
    <fieldset>
      <legend style={{ margin: "2%" }}>Sample attributes :</legend>
      <div style={style.top}>
        <TextField
          style={{
            width: "25%",
            marginTop: "15px",
          }}
          InputLabelProps={{
            shrink: true,
          }}
          name="weight"
          variant="outlined"
          id="weight"
          label="Weight"
          onChange={formik.handleChange}
          error={formik.touched.weight && Boolean(formik.errors.weight)}
          helperText={formik.touched.weight && formik.errors.weight}
          autoComplete="weight"
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
          name="length"
          variant="outlined"
          id="length"
          label="Length"
          onChange={formik.handleChange}
          error={formik.touched.length && Boolean(formik.errors.length)}
          helperText={formik.touched.length && formik.errors.length}
          autoComplete="length"
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
          name="diameter"
          variant="outlined"
          id="diameter"
          label="Diameter"
          onChange={formik.handleChange}
          error={formik.touched.diameter && Boolean(formik.errors.diameter)}
          helperText={formik.touched.diameter && formik.errors.diameter}
          autoComplete="diameter"
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
          name="load"
          variant="outlined"
          id="load"
          label="Load"
          onChange={formik.handleChange}
          error={formik.touched.load && Boolean(formik.errors.load)}
          helperText={formik.touched.load && formik.errors.load}
          autoComplete="load"
          margin="dense"
        />
      </div>
      <div style={style.top}>
        <TextField
          style={{
            width: "20%",
            marginTop: "15px",
          }}
          id="fracture"
          select
          onChange={formik.handleChange}
          name="fracture"
          SelectProps={{
            native: true,
          }}
          helperText="Fracture"
          margin="dense"
          error={formik.touched.fracture && Boolean(formik.errors.fracture)}
        >
          {Fractures.map((option) => {
            return (
              <option key={option.id} value={option.type}>
                {option.type}
              </option>
            );
          })}
        </TextField>
      </div>
    </fieldset>
  );
});

export default SandEquivalent;
