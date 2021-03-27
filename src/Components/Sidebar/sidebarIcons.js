import DescriptionIcon from "@material-ui/icons/Description";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import PanoramaVerticalIcon from "@material-ui/icons/PanoramaVertical";
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export function renderSwitch(label) {
  switch (label) {
    case "Logbook":
      return (
        <HomeIcon
          style={{
            fontSize: "25px",
            color: "#E0F5F2",
          }}
        />
      );
    case "Clients":
      return (
        <PeopleIcon
          style={{
            fontSize: "25px",
            color: "#E0F5F2",
          }}
        />
      );
    case "Samples":
      return (
        <PanoramaVerticalIcon
          style={{
            fontSize: "25px",
            color: "#E0F5F2",
          }}
        />
      );
    case "Tests":
      return (
        <DeveloperBoardIcon
          style={{
            fontSize: "25px",
            color: "#E0F5F2",
          }}
        />
      );
    case "Projects":
      return (
        <AccountTreeIcon
          style={{
            fontSize: "25px",
            color: "#E0F5F2",
          }}
        />
      );
    case "Tasks":
      return (
        <AssignmentIcon
          style={{
            fontSize: "25px",
            color: "#E0F5F2",
          }}
        />
      );
    case "Users":
      return (
        <AssignmentIndIcon
          style={{
            fontSize: "25px",
            color: "#E0F5F2",
          }}
        />
      );
    default:
      return (
        <DescriptionIcon
          style={{
            fontSize: "25px",
            color: "#E0F5F2",
          }}
        />
      );
  }
}

export function ArrowsIcons(items, open) {
  if (Array.isArray(items)) {
    switch (open) {
      case true:
        return (
          <ArrowDropUpIcon
            style={{
              marginRight: "15%",
              fontSize: "25px",
              color: "#E0F5F2",
              alignSelf: "right",
            }}
          />
        );
      case false:
        return (
          <ArrowDropDownIcon
            style={{
              marginRight: "15%",
              fontSize: "25px",
              color: "#E0F5F2",
              alignSelf: "right",
            }}
          />
        );
      default:
        return (
          <div
            style={{
              marginRight: "25%",
              fontSize: "25px",
              color: "#E0F5F2",
            }}
          ></div>
        );
    }
  } else {
    return (
      <div
        style={{
          marginRight: "25%",
          fontSize: "25px",
          color: "#E0F5F2",
        }}
      ></div>
    );
  }
}
