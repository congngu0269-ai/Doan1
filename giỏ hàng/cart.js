document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lấy các phần tử DOM ---
    const cartItemsBody = document.getElementById('cart-items-body');
    const emptyCartMsg = document.getElementById('cart-empty-message');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    
    // Phần Tóm tắt
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');
    const itemCountEl = document.getElementById('summary-item-count');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    // Phần Voucher
    const voucherInput = document.getElementById('voucher-input');
    const applyVoucherBtn = document.querySelector('.btn-apply-voucher');
    const discountRow = document.getElementById('discount-row');
    const discountEl = document.getElementById('summary-discount');

    const SHIPPING_FEE = 30000; // 30k ship
    let cart = []; 
    let currentDiscount = 0; // Số tiền giảm giá

    // --- Hàm Helper: Xử lý giá tiền an toàn ---
    // Hàm này sẽ lọc bỏ mọi ký tự không phải số (dấu chấm, chữ đ, $, dấu phẩy...)
    function parsePrice(price) {
        if (typeof price === 'number') return price;
        if (!price) return 0;
        
        // Chuyển về chuỗi và chỉ giữ lại số
        const numberString = price.toString().replace(/[^0-9]/g, '');
        return parseInt(numberString) || 0;
    }

    // --- Hàm 1: Tải giỏ hàng từ LocalStorage ---
    function loadCart() {
        let cartFromStorage = JSON.parse(localStorage.getItem('cart')) || [];
        // Đảm bảo mọi item đều có thuộc tính 'selected' (mặc định là true)
        cart = cartFromStorage.map(item => ({
            ...item,
            selected: item.selected !== undefined ? item.selected : true
        }));
        renderCart();
    }

    // --- Hàm 2: Lưu giỏ hàng ---
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // --- Hàm 3: Render giao diện ---
    function renderCart() {
        if (!cartItemsBody) return; // Bảo vệ nếu không tìm thấy bảng

        cartItemsBody.innerHTML = '';
        
        if (cart.length === 0) {
            emptyCartMsg.style.display = 'block';
            const header = document.querySelector('.cart-table-header');
            if(header) header.style.display = 'none';
        } else {
            emptyCartMsg.style.display = 'none';
            const header = document.querySelector('.cart-table-header');
            if(header) header.style.display = 'grid';

            cart.forEach(item => {
                const itemHTML = createCartItemHTML(item);
                cartItemsBody.innerHTML += itemHTML;
            });
        }
        
        updateSummary();
        updateSelectAllCheckboxState();
    }

    // --- Hàm 4: Tạo HTML từng sản phẩm ---
    function createCartItemHTML(item) {
        const priceNum = parsePrice(item.price);
        const subtotalNum = priceNum * item.quantity;
        const itemSubtotalStr = subtotalNum.toLocaleString('vi-VN') + ' ₫';
        
        return `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-info">
                <input type="checkbox" class="product-checkbox" ${item.selected ? 'checked' : ''}>
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <div class="name">${item.name}</div>
                </div>
            </div>
            <div class="item-price">${item.price}</div>
            <div class="item-quantity">
                <div class="quantity-selector">
                    <button class="qty-btn minus" aria-label="Giảm">-</button>
                    <input type="text" class="qty-value" value="${item.quantity}" readonly>
                    <button class="qty-btn plus" aria-label="Tăng">+</button>
                </div>
            </div>
            <div class="item-subtotal">${itemSubtotalStr}</div>
            <div class="item-action">
                <button class="remove-btn"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        `;
    }

    // --- Hàm 5: Tính toán tổng tiền ---
    function updateSummary() {
        let subtotal = 0;
        let selectedItemCount = 0;

        cart.forEach(item => {
            if (item.selected) {
                const priceNum = parsePrice(item.price);
                subtotal += priceNum * item.quantity;
                selectedItemCount += item.quantity;
            }
        });

        // Nếu không chọn sản phẩm nào thì phí ship = 0
        const shipping = selectedItemCount > 0 ? SHIPPING_FEE : 0;
        
        // Tính tổng cuối cùng
        let total = subtotal + shipping - currentDiscount;
        if (total < 0) total = 0;

        if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString('vi-VN') + ' ₫';
        if (shippingEl) shippingEl.textContent = shipping.toLocaleString('vi-VN') + ' ₫';
        if (totalEl) totalEl.textContent = total.toLocaleString('vi-VN') + ' ₫';
        if (itemCountEl) itemCountEl.textContent = selectedItemCount;

        // Hiển thị dòng giảm giá nếu có
        if (discountRow && discountEl) {
            if (currentDiscount > 0) {
                discountRow.style.display = 'flex';
                discountEl.textContent = '-' + currentDiscount.toLocaleString('vi-VN') + ' ₫';
            } else {
                discountRow.style.display = 'none';
            }
        }
    }

    // --- Hàm 6: Cập nhật checkbox "Chọn Tất Cả" ---
    function updateSelectAllCheckboxState() {
        if (!selectAllCheckbox) return;
        if (cart.length > 0 && cart.every(item => item.selected)) {
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.checked = false;
        }
    }

    // --- SỰ KIỆN ---

    if (cartItemsBody) {
        cartItemsBody.addEventListener('click', (e) => {
            const target = e.target;
            const itemElement = target.closest('.cart-item');
            if (!itemElement) return;
            
            const id = itemElement.dataset.id;
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex === -1) return;

            // Tăng số lượng
            if (target.classList.contains('plus')) {
                cart[itemIndex].quantity++;
                saveCart(); renderCart();
            }
            // Giảm số lượng
            else if (target.classList.contains('minus')) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    if (confirm("Bạn có muốn xóa sản phẩm này không?")) {
                        cart.splice(itemIndex, 1);
                    }
                }
                saveCart(); renderCart();
            }
            // Xóa sản phẩm
            else if (target.closest('.remove-btn')) {
                if (confirm("Xóa sản phẩm khỏi giỏ hàng?")) {
                    cart.splice(itemIndex, 1);
                }
                saveCart(); renderCart();
            }
            // Tích chọn checkbox
            else if (target.classList.contains('product-checkbox')) {
                cart[itemIndex].selected = target.checked;
                saveCart();
                updateSummary();
                updateSelectAllCheckboxState();
            }
        });
    }

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            cart.forEach(item => item.selected = isChecked);
            saveCart();
            renderCart();
        });
    }

    // --- XỬ LÝ VOUCHER (QUAN TRỌNG) ---
    if (applyVoucherBtn && voucherInput) {
        applyVoucherBtn.addEventListener('click', () => {
            const code = voucherInput.value.trim().toUpperCase();
            
            // Reset discount để tính lại
            currentDiscount = 0;

            if (code === "") {
                 alert("Vui lòng nhập mã giảm giá!");
                 updateSummary();
                 return;
            }

            if (code === "HMSHOP10") { // Mã demo
                currentDiscount = 10000; 
                alert("Áp dụng mã giảm giá 10.000đ thành công!");
            } else if (code === "FREESHIP") { // Mã demo freeship
                // Tính tổng tiền hàng được chọn
                let subtotalCheck = 0;
                cart.forEach(item => {
                    if (item.selected) {
                        subtotalCheck += parsePrice(item.price) * item.quantity;
                    }
                });
                
                if (subtotalCheck > 0) {
                     currentDiscount = 30000; // Giảm bằng phí ship
                     alert("Áp dụng mã Freeship thành công!");
                } else {
                    alert("Vui lòng chọn sản phẩm để áp dụng mã Freeship!");
                    currentDiscount = 0;
                }

            } else {
                alert("Mã giảm giá không hợp lệ! (Thử: HMSHOP10 hoặc FREESHIP)");
                currentDiscount = 0;
            }
            updateSummary();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const itemsToCheckout = cart.filter(item => item.selected);
            if (itemsToCheckout.length === 0) {
                alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
                return;
            }
            
            // Tính tổng tiền
            let subtotal = 0;
            itemsToCheckout.forEach(item => {
                subtotal += parsePrice(item.price) * item.quantity;
            });
            
            const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
            let total = subtotal + shipping - currentDiscount;
            if (total < 0) total = 0;
            
            const totalStr = total.toLocaleString('vi-VN') + ' ₫';

            alert(`Sắp chuyển đến trang thanh toán.\nSố lượng: ${itemsToCheckout.length} sản phẩm.\nTổng thanh toán: ${totalStr}`);
            
            // Xử lý sau khi thanh toán thành công (Giả lập)
            cart = cart.filter(item => !item.selected);
            saveCart();
            
            currentDiscount = 0;
            if (voucherInput) voucherInput.value = "";
            
            window.location.href = "../order/order.html";
        });
    }

    // Khởi chạy
    loadCart();
});