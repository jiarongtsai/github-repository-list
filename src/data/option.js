export const options = [
  {
    term: "type",
    list: [
      { value: "all", text: "All" },
      { value: "public", text: "Public" },
      { value: "forks", text: "Forks" },
      { value: "sources", text: "Sources" },
    ],
  },
  {
    term: "sort",
    list: [
      { value: "created", text: "Created" },
      { value: "updated", text: "Updated" },
      { value: "pushed", text: "Pushed" },
      { value: "full_name", text: "Full Name" },
    ],
  },
  {
    term: "direction",
    list: [
      { value: "desc", text: "Descend" },
      { value: "asc", text: "Ascend" },
    ],
  },
];
