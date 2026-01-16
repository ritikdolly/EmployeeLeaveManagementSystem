function employeeNavigate(page, element) {
  document
    .querySelectorAll(".nav-tab")
    .forEach((li) => li.classList.remove("active"));
  element.classList.add("active");

  const user = JSON.parse(localStorage.getItem("user"));

  if (page === "dashboard") loadEmployeeDashboardPage(user);
  if (page === "apply") loadApplyLeavePage(user);
  if (page === "history") loadEmployeeHistoryPage(user);
}

function loadEmployeeDashboardPage(user) {
  fetch(`http://localhost:8080/api/dashboard/employee-stats?userId=${user.id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    })
    .then((stats) => {
      document.getElementById("pageContent").innerHTML = `
            <div class="welcome-banner">
               <div class="welcome-text">
                    <h2>Welcome back, ${user.name}</h2>
                    <p>Manage your time off efficiently.</p> 
               </div>
               <div class="balance-box">
                    <span>Leave Balance</span>
                    <h2 id="dashBalance">${stats.leaveBalance} Days</h2>
               </div>
            </div>

            <h3 class="section-title"><i class='bx bxs-widget'></i> Overview</h3>

            <div class="cards">
                <div class="card">
                     <div class="card-icon green">
                        <i class='bx bx-check-circle'></i>
                    </div>
                    <div class="card-info">
                        <h4>Approved</h4>
                        <h2>${stats.approvedRequests}</h2>
                    </div>
                </div>
                <div class="card">
                    <div class="card-icon yellow">
                         <i class='bx bx-time-five'></i>
                    </div>
                    <div class="card-info">
                        <h4>Pending</h4>
                        <h2>${stats.pendingRequests}</h2>
                    </div>
                </div>
                 <div class="card">
                    <div class="card-icon blue">
                        <i class='bx bx-x-circle'></i>
                    </div>
                    <div class="card-info">
                        <h4>Rejected</h4>
                        <h2>${stats.rejectedRequests}</h2>
                    </div>
                </div>
            </div>
        `;
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

function loadApplyLeavePage(user) {
  document.getElementById("pageContent").innerHTML = `
        <div class="section">
            <h3>Apply for Leave</h3>
            
            <div class="form-group">
                <label>Leave Type</label>
                <select id="leaveType">
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Personal">Personal</option>
                </select>
            </div>

            <div style="display:flex;gap:15px">
                <div class="form-group" style="flex:1">
                    <label>Start Date</label>
                    <input type="date" id="startDate" onchange="calculateDuration()">
                </div>
                <div class="form-group" style="flex:1">
                    <label>End Date</label>
                    <input type="date" id="endDate" onchange="calculateDuration()">
                </div>
            </div>

            <div class="section" style="background:#eef2ff">
                <strong>Duration:</strong>
                <span id="duration">0 Days</span>
            </div>

            <div class="form-group">
                <label>Reason</label>
                <textarea id="reason" rows="4" placeholder="Enter reason"></textarea>
            </div>

            <button class="btn btn-primary" onclick="submitLeaveRequest(${user.id})" style="width:100%">Submit Request</button>
        </div>
    `;
}

function calculateDuration() {
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);

  if (!isNaN(start) && !isNaN(end) && end >= start) {
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById("duration").innerText = days + " Days";
  } else {
    document.getElementById("duration").innerText = "0 Days";
  }
}

function submitLeaveRequest(userId) {
  const leaveType = document.getElementById("leaveType").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const reason = document.getElementById("reason").value;

  if (!startDate || !endDate || !reason) {
    alert("Please fill all fields");
    return;
  }

  // Simple date validation
  if (new Date(endDate) < new Date(startDate)) {
    alert("End date cannot be before start date");
    return;
  }

  const payload = {
    leaveType: leaveType,
    startDate: startDate,
    endDate: endDate,
    reason: reason,
  };

  fetch("http://localhost:8080/api/leaves/apply?userId=" + userId, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok)
        return res.text().then((text) => {
          throw new Error(text);
        });
      return res.json();
    })
    .then((data) => {
      alert("Leave applied successfully!");
      employeeNavigate(
        "history",
        document.querySelector(".nav-tab:nth-child(3)")
      ); // Hacky nav
    })
    .catch((err) => {
      alert("Error: " + err.message);
    });
}

function loadEmployeeHistoryPage(user) {
  document.getElementById("pageContent").innerHTML = "Loading...";

  fetch("http://localhost:8080/api/leaves/my-history?userId=" + user.id)
    .then((res) => res.json())
    .then((leaves) => {
      let rows = "";
      leaves.forEach((leave) => {
        let badgeClass =
          leave.status === "APPROVED"
            ? "approved"
            : leave.status === "REJECTED"
            ? "rejected"
            : "pending";

        let comment = leave.managerComment || "-";

        rows += `
                    <tr>
                        <td>${leave.leaveType}</td>
                        <td>${leave.startDate} to ${leave.endDate}</td>
                        <td>${leave.reason}</td>
                        <td>${comment}</td>
                        <td><span class="badge ${badgeClass}">${leave.status}</span></td>
                    </tr>
                `;
      });

      document.getElementById("pageContent").innerHTML = `
                <div class="section">
                    <h3>History</h3>
                    <table class="table">
                        <tr>
                            <th>Type</th>
                            <th>Dates</th>
                            <th>Reason</th>
                            <th>Manager Comment</th>
                            <th>Status</th>
                        </tr>
                        ${rows}
                    </table>
                    ${
                      leaves.length === 0
                        ? '<p style="text-align:center;padding:20px">No leave history found.</p>'
                        : ""
                    }
                </div>
            `;
    })
    .catch((err) => console.error(err));
}
