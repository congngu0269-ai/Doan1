const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const registerUserBtn = document.getElementById("register-user");
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
    console.log("Đã tạo thành công:", result);
    container.classList.remove("active");
  } catch (error) {
    console.error("Lỗi khi gửi:", error);
  }
}

registerUserBtn.addEventListener("click", async () => {
  const emailValue = document.getElementById("register-email").value;
  const passwordValue = document.getElementById("register-password").value;
  // 3. Kiểm tra xem dữ liệu có rỗng không (Validation đơn giản)
  if (!emailValue || !passwordValue) {
    return;
  }

  await createUser(emailValue, passwordValue);
});
