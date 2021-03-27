import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import { Link } from "react-router-dom";
import { renderSwitch, ArrowsIcons } from "./sidebarIcons";

function SubItem({
  label,
  path,
  items,
  depthStep = 20,
  depth = 0.5,
  isVisible,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem
        button
        dense
        onClick={() => {
          if (!Array.isArray(items)) {
            rest.checksidebar();
          }
        }}
        {...rest}
        style={{
          margin: 0,
          padding: "0%",
        }}
      >
        <Link
          className="SidebarLink"
          to={path}
          button
          onClick={handleClick}
          style={{
            paddingLeft: depth * depthStep,
            width: "100%",
            height: "100%",
            paddingTop: "5%",
            paddingBottom: "5%",
          }}
        >
          {renderSwitch(label)}
          <span>{label}</span>
          {ArrowsIcons(items, open)}
        </Link>
      </ListItem>
      {Array.isArray(items) ? (
        <List disablePadding dense>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {items.map((subItem) => (
              <SubItem
                key={subItem.name}
                depth={depth + 1}
                depthStep={depthStep}
                {...subItem}
                onClick={() => rest.checksidebar()}
              />
            ))}
          </Collapse>
        </List>
      ) : null}
    </>
  );
}
//
function Sidebar({
  isVisible,
  forwardedRef,
  checksidebar,
  items,
  depthStep,
  depth,
  state,
}) {
  return (
    <div
      className={isVisible ? "nav-menu" : "nav-menu active"}
      ref={forwardedRef}
    >
      <List disablePadding dense>
        <ListItem>
          <div className="space"></div>
        </ListItem>
        {items.map((subItem, index) => (
          <SubItem
            key={`${subItem.name}${index}`}
            depthStep={depthStep}
            depth={depth}
            {...subItem}
            checksidebar={checksidebar}
            isVisible={isVisible}
          />
        ))}
      </List>
      <div style={{ marginBottom: "150px" }}></div>
    </div>
  );
}

export default Sidebar;
