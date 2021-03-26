import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import style from "./style";
const comp1 = React.memo(({ formik, Selection, CheckingType }) => {
  const [Type, setType] = useState([]);
  const [Grade, setGrade] = useState([]);
  const [TypeDisplay, setTypeDisplay] = useState("inline");

  const getType = (e) => {
    setType([]);
    let value = e.target.value;
    if (value) {
      let newtype = Selection.types.filter((type) => type.type === value)[0];

      setType(newtype.description);
      if (newtype.belongs === "Concrete") {
        CheckingType({ type: true });

        setTypeDisplay("inline");
      } else {
        CheckingType({ type: false });

        setTypeDisplay("none");
      }
    }
  };

  const getGrade = (e) => {
    setGrade([]);
    let value = e.target.value;
    if (value) {
      const grade = Selection.grades.filter((grade) => grade.name === value)[0]
        .description;
      setGrade(grade);
      if (grade.length) {
        CheckingType({ typeDes: true });
        console.log(grade);
      } else {
        console.log(grade);
        CheckingType({ typeDes: false });
      }
    }
  };

  return (
    <fieldset>
      <legend style={{ margin: "1%" }}>Sample attributes :</legend>
      <div style={style.top}>
        <TextField
          style={style.TextField}
          id="type"
          select
          onChange={(e) => {
            getType(e);
            formik.handleChange(e);
          }}
          name="type"
          SelectProps={{
            native: true,
          }}
          helperText="Sample Type"
          margin="dense"
          error={formik.touched.type && Boolean(formik.errors.type)}
        >
          <option value=""></option>
          {Selection.types.map((option) => {
            return (
              <option key={option.id} value={option.type}>
                {option.type}
              </option>
            );
          })}
        </TextField>

        <TextField
          style={{
            ...style.TextField,
            display: Type[0] ? "inline" : "none",
          }}
          id="type_description"
          select
          onChange={formik.handleChange}
          name="type_description"
          SelectProps={{
            native: true,
          }}
          helperText="Type Description"
          margin="dense"
          error={
            formik.touched.type_description &&
            Boolean(formik.errors.type_description)
          }
        >
          <option value="None">None</option>
          {Type.map((option) => {
            return (
              <option key={option.id} value={option.description}>
                {option.description}
              </option>
            );
          })}
        </TextField>
      </div>
      <div style={style.top}>
        <TextField
          style={{ ...style.TextField, display: TypeDisplay }}
          id="grade"
          select
          onChange={(e) => {
            getGrade(e);
            formik.handleChange(e);
          }}
          name="grade"
          SelectProps={{
            native: true,
          }}
          helperText="Grade"
          margin="dense"
          error={formik.touched.grade && Boolean(formik.errors.grade)}
        >
          <option value=""></option>
          {Selection.grades.map((option) => {
            return (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            );
          })}
        </TextField>
        <TextField
          style={{
            ...style.TextField,
            display: Grade[0] ? TypeDisplay : "none",
          }}
          id="mix_description"
          select
          onChange={formik.handleChange}
          name="mix_description"
          SelectProps={{
            native: true,
          }}
          helperText="Mix description"
          margin="dense"
          error={
            formik.touched.mix_description &&
            Boolean(formik.errors.mix_description)
          }
        >
          <option value="None">None</option>
          {Grade.map((option) => {
            return (
              <option key={option.id} value={option.description}>
                {option.description}
              </option>
            );
          })}
        </TextField>
      </div>
      <div style={style.top}>
        <TextField
          style={{
            ...style.TextField,
            display: TypeDisplay === "inline" ? "none" : "inline",
          }}
          name="test_date"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          type="date"
          id="test_date"
          label="Test Date"
          onChange={formik.handleChange}
          error={formik.touched.test_date && Boolean(formik.errors.test_date)}
          helperText={formik.touched.test_date && formik.errors.test_date}
          autoComplete="cast_date"
          margin="dense"
        />
        <TextField
          style={{ ...style.TextField, display: TypeDisplay }}
          name="cast_date"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          type="date"
          id="cast_date"
          label="Cast Date"
          onChange={formik.handleChange}
          error={formik.touched.cast_date && Boolean(formik.errors.cast_date)}
          helperText={formik.touched.cast_date && formik.errors.cast_date}
          autoComplete="cast_date"
          margin="dense"
        />
        <TextField
          style={
            (style.TextField,
            {
              width: "20%",
              marginRight: "15%",
              marginTop: "15px",
              display: TypeDisplay,
            })
          }
          InputLabelProps={{
            shrink: true,
          }}
          name="age"
          variant="outlined"
          id="age"
          label="Age"
          onChange={formik.handleChange}
          error={formik.touched.age && Boolean(formik.errors.age)}
          helperText={formik.touched.age && formik.errors.age}
          autoComplete="age"
          margin="dense"
        />
      </div>
    </fieldset>
  );
});

export default comp1;
