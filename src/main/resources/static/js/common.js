function loadDashboard() {
  // Get user from storage
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in, redirect to login page
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  if (user.role === "MANAGER") {
    renderManagerDashboard(user);
  } else {
    renderEmployeeDashboard(user);
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
