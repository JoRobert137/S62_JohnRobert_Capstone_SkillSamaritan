export const getTaskStatusMeta = (status) => {
  switch (status) {
    case "accepted":
      return {
        label: "In Progress",
        badgeClass: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      };
    case "pending_verification":
      return {
        label: "Awaiting Confirmation",
        badgeClass: "bg-orange-100 text-orange-700 border border-orange-200",
      };
    case "completed":
      return {
        label: "Completed",
        badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
      };
    case "open":
    default:
      return {
        label: "Open",
        badgeClass: "bg-green-100 text-green-700 border border-green-200",
      };
  }
};
