function employeeNavigate(page, element) {
  document
    .querySelectorAll(".menu li")
    .forEach((li) => li.classList.remove("active"));
  element.classList.add("active");

  const user = JSON.parse(localStorage.getItem("user"));

  if (page === "dashboard") loadEmployeeDashboardPage(user);
  if (page === "apply") loadApplyLeavePage(user);
  if (page === "history") loadEmployeeHistoryPage(user);
}

function loadEmployeeDashboardPage(user) {
  // In a real app complexity, fetch fresh balance here
  document.getElementById("pageContent").innerHTML = `
        <div class="section" style=" display: flex; align-items: center; justify-content: space-between; background:linear-gradient(90deg,#6366f1,#9333ea);color:white;">
           <div>
            <h2>Welcome back, ${user.name}</h2>
            <p>Manage your time off efficiently.</p> 
            </div>
            <div style="float:right;background:rgba(255,255,255,0.2);padding:15px;border-radius:10px">
                <strong>Leave Balance</strong>
                <h2 id="dashBalance">${user.leaveBalance} Days</h2>
            </div>
        </div>
    `;
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
        document.querySelector(".menu li:nth-child(3)")
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
        rows += `
                    <tr>
                        <td>${leave.leaveType}</td>
                        <td>${leave.startDate} to ${leave.endDate}</td>
                        <td>${leave.reason}</td>
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
