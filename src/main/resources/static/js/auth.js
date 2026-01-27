// Check if already logged in
if (localStorage.getItem("user")) {
  window.location.href = "dashboard.html";
}

// LOGIN HANDLER
function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Print in console
  console.log("LOGIN DATA");
  console.log("Email:", email);
  console.log("Password:", password);

  // Payload to backend
  const loginData = {
    email: email,
    password: password,
  };

  console.log("Sending to Auth Controller:", loginData);

  // Redirect to backend auth controller
  // (replace URL based on your backend)
  fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((res) => {
      if (!res.ok) {
        // Handle authentication errors
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            "Invalid email or password. Please check your credentials and try again.",
          );
        } else if (res.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error("Login failed. Please try again.");
        }
      }
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "dashboard.html";
    })
    .catch((err) => {
      alert("❌ " + err.message);
      console.error("Login error:", err);
    });
}

// REGISTER HANDLEr
function register(event) {
  event.preventDefault();

  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: password,
    role: document.getElementById("role").value,
    leaveBalance: parseInt(document.getElementById("leaveBalance").value),
  };

  console.log("REGISTER DATA:", data);

  fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Registered successfully");
    })
    .catch((err) => console.error(err));
}

// ADMIN CONTACT MODAL FUNCTIONS
function showAdminContacts(event) {
  event.preventDefault();

  const modal = document.getElementById("adminContactModal");
  const messageEl = document.getElementById("adminMessage");
  const emailListEl = document.getElementById("adminEmailList");

  // Show modal
  modal.style.display = "flex";

  // Reset content
  messageEl.textContent = "Loading admin contacts...";
  emailListEl.innerHTML = "";

  // Fetch admin contacts from backend
  fetch("http://localhost:8080/auth/admin-contacts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      messageEl.textContent =
        data.message || "Please contact one of the following administrators:";

      if (data.adminEmails && data.adminEmails.length > 0) {
        const emailList = document.createElement("ul");
        emailList.className = "admin-email-list";

        data.adminEmails.forEach((email) => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = `mailto:${email}`;
          link.textContent = email;
          link.className = "admin-email-link";
          li.appendChild(link);
          emailList.appendChild(li);
        });

        emailListEl.appendChild(emailList);
      } else {
        emailListEl.innerHTML =
          "<p class='no-admins'>No administrators found. Please contact your IT department.</p>";
      }
    })
    .catch((err) => {
      console.error("Error fetching admin contacts:", err);
      messageEl.textContent = "Error loading admin contacts.";
      emailListEl.innerHTML =
        "<p class='error-message'>Unable to load administrator contacts. Please try again later.</p>";
    });
}

function closeAdminModal() {
  const modal = document.getElementById("adminContactModal");
  modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("adminContactModal");
  if (event.target === modal) {
    closeAdminModal();
  }
};
