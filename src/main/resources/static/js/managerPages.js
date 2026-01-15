function managerNavigate(page, element) {
  document
    .querySelectorAll(".menu li")
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
  // Fetch Pending count
  fetch("http://localhost:8080/api/leaves/pending")
    .then((res) => res.json())
    .then((data) => {
      const pendingCount = data.length;

      document.getElementById("pageContent").innerHTML = `
                <div class="cards">
                    <div class="card">
                        <h4>Pending Requests</h4>
                        <h2>${pendingCount}</h2>
                    </div>
                </div>
            `;
    })
    .catch((err) => console.error(err));
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
                <table class="table">
                    <tr>
                        <th>Employee</th>
                        <th>Type</th>
                        <th>Dates</th>
                        <th>Status</th>
                    </tr>
                    ${rows}
                </table>
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
                ${leaves.length === 0 ? "<p>No pending requests.</p>" : ""}
            `;
    });
}

function processLeave(leaveId, action, managerId) {
  if (!confirm(`Are you sure you want to ${action} this request?`)) return;

  fetch(
    `http://localhost:8080/api/leaves/${leaveId}/${action}?managerId=${managerId}`,
    {
      method: "POST",
    }
  )
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
