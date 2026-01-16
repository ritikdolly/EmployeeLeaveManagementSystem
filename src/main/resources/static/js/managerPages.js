function managerNavigate(page, element) {
  document
    .querySelectorAll(".nav-tab")
    .forEach((li) => li.classList.remove("active"));
  element.classList.add("active");

  const user = JSON.parse(localStorage.getItem("user"));

  switch (page) {
    case "dashboard":
      loadManagerDashboardPage(user);
      break;
    case "calendar":
      loadManagerCalendarPage(user);
      break;
    case "employees":
      loadManageEmployeesPage(user);
      break;
    case "requests":
      loadManagerRequestsPage(user);
      break;
  }
}

function loadManagerDashboardPage(user) {
  // Fetch Manager Stats
  fetch("http://localhost:8080/api/dashboard/manager-stats")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    })
    .then((data) => {
      // Render Dashboard Content
      document.getElementById("pageContent").innerHTML = `
                <div class="cards">
                    <div class="card">
                         <div class="card-icon blue">
                            <i class='bx bx-user'></i>
                        </div>
                        <div class="card-info">
                            <h4>Total Employees</h4>
                            <h2>${data.totalEmployees}</h2>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-icon yellow">
                            <i class='bx bx-time-five'></i>
                        </div>
                        <div class="card-info">
                            <h4>Pending Requests</h4>
                            <h2>${data.pendingRequests}</h2>
                        </div>
                    </div>
                    <div class="card">
                         <div class="card-icon green">
                            <i class='bx bx-calendar-check'></i>
                        </div>
                        <div class="card-info">
                            <h4>On Leave Today</h4>
                            <h2>${data.onLeaveToday}</h2>
                        </div>
                    </div>
                </div>

                <!-- Sub-Nav / Tabs (As per screenshot, simplified) -->
                <div class="sub-nav" style="padding: 0; margin-bottom: 30px;">
                </div>

                <h3 class="section-title"><i class='bx bx-time'></i> Pending Approvals</h3>
                <!-- Container for pending requests table if we want to show it here by default -->
                <div id="pendingRequestsPreview" style="margin-bottom: 40px;"></div> 

                <h3 class="section-title">History</h3>
                <div id="historyPreview"></div>
            `;

      // 1. Load Pending Requests Preview
      fetch("http://localhost:8080/api/leaves/pending")
        .then((res) => res.json())
        .then((leaves) => {
          const container = document.getElementById("pendingRequestsPreview");
          if (leaves.length === 0) {
            // Styled as per screenshot: dashed border, centered text
            container.innerHTML = `<div style="padding: 40px; color: #64748b; background:white; border-radius:12px; border:2px dashed #e2e8f0; text-align:center;">No pending requests at the moment.</div>`;
          } else {
            let rows = "";
            leaves.forEach((leave) => {
              rows += `
                                <tr>
                                    <td>${
                                      leave.user ? leave.user.name : "Unknown"
                                    }</td>
                                    <td>${leave.leaveType}</td>
                                    <td>${leave.startDate} to ${
                leave.endDate
              }</td>
                                    <td><span class="badge pending">Pending</span></td>
                                </tr>
                            `;
            });

            container.innerHTML = `
                            <div class="table-container">
                                <table class="table">
                                    <tr>
                                        <th>Employee</th>
                                        <th>Type</th>
                                        <th>Dates</th>
                                        <th>Status</th>
                                    </tr>
                                    ${rows}
                                </table>
                            </div>
                          `;
          }
        })
        .catch((err) => console.error(err));

      // 2. Load History (Approved/Rejected)
      fetch("http://localhost:8080/api/leaves/history") // We need to add this endpoint or reuse existing
        .then((res) => {
          if (res.ok) return res.json();
          // If API doesn't exist yet, return empty list for now to not break UI
          return [];
        })
        .then((leaves) => {
          const container = document.getElementById("historyPreview");
          let rows = "";
          // Take last 5
          leaves.slice(0, 5).forEach((leave) => {
            let badgeClass =
              leave.status === "APPROVED" ? "approved" : "rejected";
            rows += `
                            <tr>
                                <td>${
                                  leave.user ? leave.user.name : "Unknown"
                                }</td>
                                <td>${leave.leaveType}</td>
                                <td>${leave.startDate} - ${leave.endDate}</td>
                                <td>${leave.reason}</td>
                                <td><span class="badge ${badgeClass}">${
              leave.status
            }</span></td>
                                <td style="color:#94a3b8; font-size:12px;">Manager</td>
                            </tr>
                         `;
          });

          if (rows === "") {
            container.innerHTML = `<div style="padding: 20px; text-align:center; color:#64748b;">No history available.</div>`;
          } else {
            container.innerHTML = `
                            <div class="table-container">
                                <table class="table">
                                    <tr>
                                        <th>Employee</th>
                                        <th>Type</th>
                                        <th>Dates</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th>Actioned By</th>
                                    </tr>
                                    ${rows}
                                </table>
                            </div>
                         `;
          }
        })
        .catch((err) => console.error("History fetch error", err));
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("pageContent").innerHTML = `
            <div class="section" style="text-align: center; color: #ef4444;">
                <i class='bx bx-error-circle' style="font-size: 48px;"></i>
                <h3>Failed to load data</h3>
                <p>There was an error loading your dashboard. Please try logging out and back in.</p>
                <button class="btn btn-danger" onclick="logout()">Logout</button>
            </div>
        `;
    });
}

function loadManagerCalendarPage() {
  fetch("http://localhost:8080/api/leaves/approved")
    .then((res) => res.json())
    .then((leaves) => {
      let rows = "";
      leaves.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      leaves.forEach((leave) => {
        rows += `
                    <tr>
                        <td>${leave.user ? leave.user.name : "Unknown"}</td>
                        <td>${leave.leaveType}</td>
                        <td>${leave.startDate} to ${leave.endDate}</td>
                        <td><span class="badge approved">Approved</span></td>
                    </tr>
                `;
      });

      document.getElementById("pageContent").innerHTML = `
                <h1>Leave Calendar</h1>
                <div class="table-container">
                    <table class="table">
                        <tr>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Dates</th>
                            <th>Status</th>
                        </tr>
                        ${rows}
                    </table>
                </div>
            `;
    });
}

function loadManageEmployeesPage() {
  document.getElementById("pageContent").innerHTML = `
        <h1>Manage Employees</h1>
        <div class="section">
            <h3>Add New Employee</h3>
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="empName">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="empEmail">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="empPassword">
            </div>
            <div class="form-group">
                <label>Initial Balance</label>
                <input type="number" id="empBalance" value="20">
            </div>
            <button class="btn btn-primary" onclick="addEmployee()">Add Employee</button>
        </div>
    `;
}

function addEmployee() {
  const data = {
    name: document.getElementById("empName").value,
    email: document.getElementById("empEmail").value,
    password: document.getElementById("empPassword").value,
    role: "EMPLOYEE",
    leaveBalance: parseInt(document.getElementById("empBalance").value),
  };

  fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to add");
      return res.json();
    })
    .then(() => {
      alert("Employee Added Successfully");
      document.getElementById("empName").value = "";
      document.getElementById("empEmail").value = "";
      document.getElementById("empPassword").value = "";
    })
    .catch((err) => alert("Error adding employee: " + err));
}

function loadManagerRequestsPage(user) {
  fetch("http://localhost:8080/api/leaves/pending")
    .then((res) => res.json())
    .then((leaves) => {
      let rows = "";
      leaves.forEach((leave) => {
        rows += `
                    <tr>
                        <td>${leave.user ? leave.user.name : "Unknown"}</td>
                        <td>${leave.leaveType}</td>
                        <td>${leave.startDate} to ${leave.endDate}</td>
                        <td>${leave.reason}</td>
                        <td>
                            <button class="btn btn-primary" onclick="processLeave(${
                              leave.id
                            }, 'approve', ${user.id})">Approve</button>
                            <button class="btn btn-danger" onclick="processLeave(${
                              leave.id
                            }, 'reject', ${user.id})">Reject</button>
                        </td>
                    </tr>
                `;
      });

      document.getElementById("pageContent").innerHTML = `
                <h1>Pending Requests</h1>
                <div class="table-container">
                    <table class="table">
                        <tr>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Dates</th>
                            <th>Reason</th>
                            <th>Actions</th>
                        </tr>
                        ${rows}
                    </table>
                </div>
                ${leaves.length === 0 ? "<p>No pending requests.</p>" : ""}
            `;
    });
}

function processLeave(leaveId, action, managerId) {
  if (!confirm(`Are you sure you want to ${action} this request?`)) return;

  const comment = prompt("Enter a comment for this action:");
  if (comment === null) return; // User cancelled prompt

  let url = `http://localhost:8080/api/leaves/${leaveId}/${action}?managerId=${managerId}`;
  if (comment) {
    url += `&comment=${encodeURIComponent(comment)}`;
  }

  fetch(url, {
    method: "POST",
  })
    .then((res) => {
      if (!res.ok)
        return res.text().then((t) => {
          throw new Error(t);
        });
      return res.json();
    })
    .then(() => {
      alert(`Request ${action}d successfully`);
      const user = JSON.parse(localStorage.getItem("user"));
      loadManagerRequestsPage(user);
    })
    .catch((err) => alert("Error: " + err.message));
}
