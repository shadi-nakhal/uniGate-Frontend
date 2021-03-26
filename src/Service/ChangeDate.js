import moment from "moment";

const AddDays = (cast_date, age) => {
  let newdate = moment(cast_date, "YYYY-MM-DD").add(age, "Days");
  let Year = newdate._d.getFullYear();
  let Month = newdate._d.getMonth();
  let Day = newdate._d.getDate();
  let thedate = new Date(Date.UTC(Year, Month, Day));
  let result = thedate.toISOString().split("T")[0];
  return result;
};

export default AddDays;
