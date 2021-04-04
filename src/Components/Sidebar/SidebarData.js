const items = [
  {
    name: "Logbook",
    label: "Logbook",
    path: "/",
  },

  {
    name: "Tasks",
    label: "Tasks",
    path: "/ManageTasks",
  },

  {
    name: "Samples",
    label: "Samples",
    items: [
      { name: "New Sample", label: "New Sample", path: "/NewSample" },
      {
        name: "Manage Samples",
        label: "Manage Samples",
        path: "/ManageSamples",
      },
    ],
  },

  {
    name: "Clients",
    label: "Clients",
    items: [
      { name: "New Client", label: "New Client", path: "/Newclient" },
      {
        name: "Manage Clients",
        label: "Manage Clients",
        path: "ManageClients",
      },
    ],
  },
  {
    name: "Projects",
    label: "Projects",
    items: [
      { name: "New Project", label: "New Project", path: "/NewProject" },
      {
        name: "Manage Projects",
        label: "Manage Projects",
        path: "/ManageProjects",
      },
    ],
  },

  {
    name: "Users",
    label: "Users",
    items: [
      { name: "New User", label: "New User", path: "/NewUser" },
      {
        name: "Manage Users",
        label: "Manage Users",
        path: "/ManageUsers",
      },
    ],
  },
];

export default items;
