function renderManagerDashboard(user) {
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
                        <span>Manager</span>
                    </div>
                    <div class="nav-avatar">${user.name.charAt(0)}</div>
                    <button class="btn-logout" onclick="logout()">
                        <i class='bx bx-log-out-circle'></i>
                    </button>
                </div>
            </nav>

            <!-- Main Content Container which will hold Tabs + Content -->
            <main class="main-container">
                 <!-- Sub Nav / Tabs inside main container for better alignment -->
                <div class="sub-nav" style="padding: 0; margin-bottom: 30px;">
                    <button class="nav-tab active" onclick="managerNavigate('dashboard', this)">Dashboard</button>
                    <button class="nav-tab" onclick="managerNavigate('requests', this)">Requests</button>
                    <button class="nav-tab" onclick="managerNavigate('employees', this)">Employees</button>
                    <button class="nav-tab" onclick="managerNavigate('calendar', this)">Calendar</button>
                </div>

                <div id="pageContent">
                    <!-- Dynamic Content -->
                </div>
            </main>
        </div>
    `;

  // default page
  loadManagerDashboardPage(user);
}
