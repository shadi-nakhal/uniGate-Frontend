import React, { useContext, useState } from "react";

function Items({ user }) {
  const itemz = [
    {
      name: "Logbook",
      label: "Logbook",
      path: "/",
      role: ["Qc manager", "Head of lab", "Technician", "Plant manager"],
    },
    {
      name: "Tasks",
      label: "Tasks",
      path: "/ManageTasks",
      role: ["Head of lab", "Technician"],
    },

    {
      name: "Projects",
      label: "Projects",
      items: [
        {
          name: "New Project",
          label: "New Project",
          path: "/NewProject",
          role: ["Qc manager", "Head of lab", "Plant manager"],
        },
        {
          name: "Manage Projects",
          label: "ProjectsBook",
          path: "/ManageProjects",
          role: ["Head of lab", "Technician", "Plant manager", "Qc manager"],
        },
      ],
      role: ["Qc manager", "Head of lab", "Technician", "Plant manager"],
    },

    {
      name: "Samples",
      label: "Samples",
      items: [
        {
          name: "New Sample",
          label: "New Sample",
          path: "/NewSample",
          role: ["Head of lab", "Technician"],
        },
        {
          name: "Manage Samples",
          label: "Manage Samples",
          path: "/ManageSamples",
          role: ["Qc manager", "Head of lab", "Technician", "Plant manager"],
        },
      ],
      role: ["Qc manager", "Head of lab", "Technician", "Plant manager"],
    },

    {
      name: "Clients",
      label: "Clients",
      items: [
        {
          name: "New Client",
          label: "New Client",
          path: "/Newclient",
          role: ["Head of lab"],
        },
        {
          name: "ManageClients",
          label: "ClientsBook",
          path: "ManageClients",
          role: ["Qc manager", "Head of lab", "Plant manager"],
        },
      ],
      role: ["Qc manager", "Head of lab", "Technician", "Plant manager"],
    },

    {
      name: "Users",
      label: "Users",
      items: [
        {
          name: "New User",
          label: "New User",
          path: "/NewUser",
          role: ["Head of lab"],
        },
        {
          name: "Manage Users",
          label: "Manage Users",
          path: "/ManageUsers",
          role: ["Head of lab"],
        },
      ],
      role: ["Head of lab"],
    },
  ];

  // filtering menu based on role
  function filtering(itemz) {
    const newitems = [];
    itemz.filter((i) => {
      if (i.role.includes(user.role)) {
        if (i.items) {
          let item = i.items.filter((k) => k.role.includes(user.role));
          if (item.length >= 2) {
            newitems.push({
              ...i,
              items: i.items.filter((k) => k.role.includes(user.role)),
            });
          } else {
            newitems.push(...item);
          }
        } else {
          newitems.push(i);
        }
      }
    });
    return newitems;
  }

  return filtering(itemz);
}

export default Items;
