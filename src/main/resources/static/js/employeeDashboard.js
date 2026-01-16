function renderEmployeeDashboard(user) {
  const root = document.getElementById("root");

  root.innerHTML = `
        <div class="dashboard-body">
             <!-- Navbar -->
            <nav class="navbar">
                <a href="#" class="nav-brand">
                    <i class='bx bxs-cube-alt'></i> HyScaler
                </a>
                <div class="nav-user">
                    <div class="nav-profile">
                        <strong>${user.name}</strong>
                        <span>Employee</span>
                    </div>
                    <div class="nav-avatar">${user.name.charAt(0)}</div>
                    <button class="btn-logout" onclick="logout()">
                        <i class='bx bx-log-out-circle'></i>
                    </button>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="main-container">
                 <!-- Sub Nav / Tabs inside main container -->
                <div class="sub-nav" style="padding: 0; margin-bottom: 30px;">
                    <button class="nav-tab active" onclick="employeeNavigate('dashboard', this)">Dashboard</button>
                    <button class="nav-tab" onclick="employeeNavigate('apply', this)">New Request</button>
                    <button class="nav-tab" onclick="employeeNavigate('history', this)">My History</button>
                </div>

                <div id="pageContent">
                    <!-- Content loads here -->
                </div>
            </main>
        </div>
    `;

  loadEmployeeDashboardPage(user);
}
