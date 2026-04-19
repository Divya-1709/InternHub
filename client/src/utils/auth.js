export const persistAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("userName", data.name || "");
  localStorage.setItem("userEmail", data.email || "");
};

export const getDashboardRoute = (role) => {
  if (role === "student") return "/student";
  if (role === "company") return "/company";
  return "/admin";
};
