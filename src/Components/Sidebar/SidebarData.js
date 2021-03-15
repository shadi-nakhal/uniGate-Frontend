const items = [
  {
    name: "Logbook",
    label: "Logbook",
    path: "/",
  },
  {
    name: "Clients",
    label: "Clients",
    items: [
      { name: "New Client", label: "New Client", path: "/NewClient" },
      {
        name: "Manage Clients",
        label: "Manage Clients",
        path: "/ManageClients",
      },
    ],
  },
  {
    name: "Projects",
    label: "Projects",
    items: [
      { name: "New Project", label: "New Project", path: "/NewProject" },
      {
        name: "Manage Clients",
        label: "Manage Clients",
        path: "/Clients",
      },
    ],
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
    name: "Tests",
    label: "Tests",
    items: [
      {
        name: "Assign Tests",
        label: "Assign Tests",
        path: "/AssignTests",
      },
      {
        name: "Tests Records",
        label: "Tests Records",
        path: "/TestsRecords",
      },
    ],
  },
  {
    name: "Tasks",
    label: "Tasks",
    items: [
      {
        name: "Assign Tasks",
        label: "Assign Tasks",
        path: "/AssignTasks",
      },
      {
        name: "Manage Tasks",
        label: "Manage Tasks",
        path: "/ManageTasks",
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
