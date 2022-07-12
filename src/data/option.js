const typeOptions = [
  { value: "all", text: "All" },
  { value: "public", text: "Public" },
  { value: "private", text: "Private" },
  { value: "forks", text: "Forks" },
  { value: "sources", text: "Sources" },
  { value: "member", text: "Member" },
];

const sortOptions = [
  { value: "created", text: "Created" },
  { value: "updated", text: "Updated" },
  { value: "pushed", text: "Pushed" },
  { value: "full_name", text: "Full Name" },
];

const directionOptions = [
  { value: "asc", text: "Ascend" },
  { value: "desc", text: "Descend" },
];

export { typeOptions, sortOptions, directionOptions };
