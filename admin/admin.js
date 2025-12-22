import { apiRequest } from "../common/common.js";

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
let logoutBtn = document.getElementById("logout-btn");

function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "/login/login.html";
}
logoutBtn.addEventListener("click", logout);

async function fetchCustomers() {
  console.log("Fetching customers...");
  return await apiRequest({
    method: "GET",
    url: "user/get",
    onError: (err) => {
      console.error("Error fetching customers:", err);
      alert("Lỗi khi tải khách hàng. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
}

function renderCustomer(customers) {
  const customerList = document.getElementById("customer-list");
  let renderCustomer = "";
  customers.forEach((customer) => {
    renderCustomer += `
    <tr>
                    <td>${customer.id}</td>
                    <td>
                      <div class="client">
                        <span>${customer.username}</span>
                      </div>
                    </td>
                    <td>
                      <div class="client">
                        <span>${customer.revenue.toLocaleString(
                          "en-US"
                        )} VND</span>
                      </div>
                    </td>

                    <td>
                      <div class="actions">
                        <span class="lab la-telegram-plane"></span>
                        <span class="las la-eye"></span>
                        <span class="las la-ellipsis-v"></span>
                      </div>
                    </td>
                  </tr>
    `;
  });

  customerList.innerHTML = renderCustomer;
}

// Chạy lần đầu khi tải trang
document.addEventListener("DOMContentLoaded", async () => {
  const customers = await fetchCustomers();
  renderCustomer(customers);
});
