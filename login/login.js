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
  const url = "http://localhost:3000/user/create";
  const dataToSend = {
    username: username,
    password: password,
  };
  try {
    const response = await fetch(url, {
      method: "POST", // Chỉ định phương thức
      headers: {
        "Content-Type": "application/json", // Bắt buộc: báo cho server biết mình gửi JSON
      },
      body: JSON.stringify(dataToSend), // Bắt buộc: chuyển object JS thành chuỗi JSON
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create user");
    }
  } catch (error) {
    console.error("error:", error);
  }
  container.classList.remove("active");
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
  const url = "http://localhost:3000/user/get";
  const dataToSend = {
    username: username,
    password: password,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const userId = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to login user");
    }
    localStorage.setItem("user", userId);
    window.location.href = "/";
  } catch (error) {
    alert("Login failed");
    console.error("error:", error);
  }
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
