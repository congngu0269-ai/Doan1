import { apiRequest } from "../common/common.js";

async function fetchOrders() {
  return await apiRequest({
    url: "orders",
    method: "GET",
    onError: (err) => {
      console.error("Error fetching orders:", err);
      alert("Lỗi khi tải đơn hàng. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
}

function renderOrder(data) {
  const tableBody = document.getElementById("order-table-body");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" style="text-align:center">Không tìm thấy đơn hàng nào.</td></tr>'; // colspan 6 vì bỏ cột thao tác
    return;
  }

  data.forEach((order) => {
    let statusText = "";
    let statusClass = "";

    switch (order.status) {
      case "pending":
        statusText = "Chờ xử lý";
        statusClass = "pending";
        break;
      case "shipping":
        statusText = "Đang giao";
        statusClass = "shipping";
        break;
      case "delivered":
        statusText = "Đã giao";
        statusClass = "delivered";
        break;
      case "cancelled":
        statusText = "Đã hủy";
        statusClass = "cancelled";
        break;
    }

    const paymentText =
      order.payment === "COD"
        ? "Thanh toán khi nhận"
        : '<span style="color:green">Đã thanh toán</span>';

    const row = document.createElement("tr");
    row.innerHTML = `
                <td><strong>#${order.id}</strong></td>
                <td>
                    <div class="client-info">
                        <h4>${order.customerName}</h4>
                    </div>
                </td>
                <td>${
                  new Date(order.createdAt).toISOString().split("T")[0]
                }</td>
                <td><span class="status">${order.goodName}</span></td>
                <td><span class="payment-status">${order.price} VND</span></td>
                <td><strong>${order.amount}</strong></td>
            `;
    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Dữ liệu mẫu Đơn Hàng (Vì chưa có Backend thật)
  let orders = await fetchOrders();
  renderOrder(orders);

  const statusFilter = document.getElementById("status-filter");
  const searchInput = document.getElementById("search-order");
});
