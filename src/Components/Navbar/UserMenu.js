import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import Cookie from "../../Service/CookieService";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import axios from "axios";

export default function FadeMenu({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(2),
        color: "gray",
      },
    },
  }));
  const classes = useStyles();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    const cookie = Cookie.get("Bearer");
    var config = {
      method: "post",
      url: "/logout",
      headers: {
        Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    axios(config)
      .then((res) => {
        Cookie.remove("Bearer");
        Cookie.remove("role");
        window.location.replace("/");
      })
      .catch((err) => {
        console.log(err, "errorrr in logout navbar");
        Cookie.remove("Bearer");
        Cookie.remove("role");
        window.location.replace("/");
      });
  };

  return (
    <div style={{ display: "flex" }}>
      {/* <div className={classes.root}>
        <Badge
          style={{ cursor: "pointer" }}
          color="secondary"
          badgeContent={user.count}
          onClick={() => {
            history.push("/ManageTasks");
          }}
        >
          <MailIcon />
        </Badge>
      </div> */}
      <Button
        aria-controls="fade-menu"
        disableFocusRipple
        aria-haspopup="true"
        onClick={handleClick}
        style={{
          color: "#c0c0c0",
          height: "35px",
          margin: "10px",
          borderRadius: "25px",
          fontSIze: "16px",
          fontWeight: "500",
        }}
      >
        <Avatar
          style={{
            color: "b8b9c0",
            width: "32px",
            height: "32px",
            marginRight: "10px",
            fontSize: "10px",
          }}
          alt="image"
          src={"http://localhost:8000/storage/images/" + user.user.image}
        />
        <span style={{ fontSize: "12px" }}>
          {user.user.firstname + " " + user.user.lastname}
        </span>
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        className="logoutMenu"
      >
        <MenuItem
          onClick={() => {
            history.push("/MyAccount");
            handleClose();
          }}
        >
          My account
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
