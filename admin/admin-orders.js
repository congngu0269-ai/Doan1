document.addEventListener('DOMContentLoaded', () => {
    
    // Dữ liệu mẫu Đơn Hàng (Vì chưa có Backend thật)
    let orders = [
        {
            id: "ORD-001",
            customer: "An Thuyên",
            phone: "0901234567",
            date: "10/12/2025",
            total: "355.000",
            status: "delivered",
            payment: "COD"
        },
        {
            id: "ORD-002",
            customer: "Goyounjung",
            phone: "0912345678",
            date: "21/11/2025",
            total: "1.200.000",
            status: "shipping",
            payment: "Banking"
        },
        {
            id: "ORD-003",
            customer: "Gumayusi",
            phone: "0987654321",
            date: "12/12/2025",
            total: "150.000",
            status: "pending",
            payment: "COD"
        }
    ];

    const tableBody = document.getElementById('order-table-body');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-order');

    // --- 1. RENDER BẢNG ĐƠN HÀNG ---
    function renderOrders(data) {
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center">Không tìm thấy đơn hàng nào.</td></tr>'; // colspan 6 vì bỏ cột thao tác
            return;
        }

        data.forEach(order => {
            let statusText = '';
            let statusClass = '';

            switch(order.status) {
                case 'pending': statusText = 'Chờ xử lý'; statusClass = 'pending'; break;
                case 'shipping': statusText = 'Đang giao'; statusClass = 'shipping'; break;
                case 'delivered': statusText = 'Đã giao'; statusClass = 'delivered'; break;
                case 'cancelled': statusText = 'Đã hủy'; statusClass = 'cancelled'; break;
            }

            const paymentText = order.payment === 'COD' ? 'Thanh toán khi nhận' : '<span style="color:green">Đã thanh toán</span>';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>#${order.id}</strong></td>
                <td>
                    <div class="client-info">
                        <h4>${order.customer}</h4>
                        <small>${order.phone}</small>
                    </div>
                </td>
                <td>${order.date}</td>
                <td><strong>${order.total}đ</strong></td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td><span class="payment-status">${paymentText}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // --- 2. LỌC & TÌM KIẾM ---
    function filterOrders() {
        const status = statusFilter.value;
        const keyword = searchInput.value.toLowerCase();

        const filtered = orders.filter(order => {
            const matchStatus = status === 'all' || order.status === status;
            const matchKeyword = order.id.toLowerCase().includes(keyword) || 
                                 order.customer.toLowerCase().includes(keyword);
            return matchStatus && matchKeyword;
        });

        renderOrders(filtered);
    }

    statusFilter.addEventListener('change', filterOrders);
    searchInput.addEventListener('keyup', filterOrders);

    // --- CHẠY LẦN ĐẦU ---
    renderOrders(orders);
});