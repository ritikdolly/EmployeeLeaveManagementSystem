function renderEmployeeDashboard(user) {
  document.getElementById("root").innerHTML = `
        <div class="layout">
            <aside class="sidebar">
                <h2 class="logo">HyScaler</h2>

                <div class="profile">
                    <div class="avatar">E</div>
                    <div>
                        <strong>${user.name}</strong>
                        <p>Employee</p>
                    </div>
                </div>

                <ul class="menu">
                    <li class="active" onclick="employeeNavigate('dashboard', this)">Dashboard</li>
                    <li onclick="employeeNavigate('apply', this)">Apply Leave</li>
                    <li onclick="employeeNavigate('history', this)">My History</li>
                </ul>

                <button class="signout" onclick="logout()">Sign Out</button>
            </aside>

            <main class="content">
                <div id="pageContent"></div>
            </main>
        </div>
    `;

  loadEmployeeDashboardPage(user);
}
