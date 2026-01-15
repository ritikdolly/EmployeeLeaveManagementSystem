function renderManagerDashboard(user) {
  const root = document.getElementById("root");

  root.innerHTML = `
        <div class="layout">

            <aside class="sidebar">
                <h2 class="logo">HyScaler</h2>

                <div class="profile">
                    <div class="avatar">S</div>
                    <div>
                        <strong>${user.name}</strong>
                        <p>Manager</p>
                    </div>
                </div>

                <ul class="menu">
                    <li class="active" onclick="managerNavigate('dashboard', this)">Dashboard</li>
                    <li onclick="managerNavigate('calendar', this)">Calendar</li>
                    <li onclick="managerNavigate('employees', this)">Manage Employees</li>
                    <li onclick="managerNavigate('requests', this)">Requests</li>
                </ul>

                <button class="signout" onclick="logout()">Sign Out</button>
            </aside>

            <main class="content">
                <div id="pageContent"></div>
            </main>

        </div>
    `;

  // default page
  loadManagerDashboardPage(user);
}
