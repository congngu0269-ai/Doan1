import { apiRequest } from "../common/common.js";

const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const registerUserBtn = document.getElementById("register-user");
const loginUserBtn = document.getElementById("login-user");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

async function createUser(username, password) {
  await apiRequest({
    url: "user/create",
    method: "POST",
    data: { username, password },
    onSuccess: () => {
      // Sign up successful, switch to login view
      container.classList.remove("active");
    },
    onError: (err) => {
      console.error("error:", error);
      alert("User created failed");
    },
  });
}
registerUserBtn.addEventListener("click", async () => {
  const emailValue = document.getElementById("register-email").value;
  const passwordValue = document.getElementById("register-password").value;
  if (!emailValue || !passwordValue) {
    return;
  }

  await createUser(emailValue, passwordValue);
});

async function login(username, password) {
  await apiRequest({
    url: "user/login",
    method: "POST",
    data: { username, password },
    onSuccess: ({ access_token, role }) => {
      // Store the access token and redirect to home page
      localStorage.setItem("access_token", access_token);
      if (role === 1) {
        window.location.href = "/admin/admin.html";
      } else {
        window.location.href = "/";
      }
    },
    onError: (err) => {
      console.error("login error:", err);
      alert("Login failed");
    },
  });
}

loginUserBtn.addEventListener("click", async () => {
  const emailValue = document.getElementById("login-email").value;
  const passwordValue = document.getElementById("login-password").value;
  if (!emailValue || !passwordValue) {
    alert("Please enter email and password");
    return;
  }

  await login(emailValue, passwordValue);
});
