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
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "dashboard.html";
    })
    .catch((err) => {
      alert("Login failed");
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
