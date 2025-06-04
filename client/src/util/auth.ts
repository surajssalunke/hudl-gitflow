export const isAuthenticated = () => {
  return !!localStorage.getItem("github_username");
};
