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

    const SHIPPING_FEE = 5.00;
    let cart = []; // Biến giỏ hàng toàn cục

    // --- Hàm 1: Tải giỏ hàng từ LocalStorage ---
    function loadCart() {
        let cartFromStorage = JSON.parse(localStorage.getItem('cart')) || [];
        // Chuẩn hóa dữ liệu: đảm bảo mọi item đều có 'selected: true'
        cart = cartFromStorage.map(item => ({
            ...item,
            selected: item.selected !== undefined ? item.selected : true
        }));
        renderCart();
    }

    // --- Hàm 2: Lưu giỏ hàng vào LocalStorage ---
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // --- Hàm 3: "Vẽ" lại toàn bộ giỏ hàng ---
    function renderCart() {
        cartItemsBody.innerHTML = ''; // Xóa nội dung cũ
        
        if (cart.length === 0) {
            emptyCartMsg.style.display = 'block';
            document.querySelector('.cart-table-header').style.display = 'none';
        } else {
            emptyCartMsg.style.display = 'none';
            document.querySelector('.cart-table-header').style.display = 'grid';

            cart.forEach(item => {
                const itemHTML = createCartItemHTML(item);
                cartItemsBody.innerHTML += itemHTML;
            });
        }
        
        updateSummary();
        updateSelectAllCheckboxState();
        addCartEventListeners(); // Gắn lại sự kiện cho các nút mới
    }

    // --- Hàm 4: Tạo HTML cho 1 sản phẩm ---
    function createCartItemHTML(item) {
        const itemPrice = parseFloat(item.price.replace('$', ''));
        const itemSubtotal = (itemPrice * item.quantity).toFixed(2);
        
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
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" aria-label="Tăng">+</button>
                </div>
            </div>
            <div class="item-subtotal">$${itemSubtotal}</div>
            <div class="item-action">
                <button class="remove-btn"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        `;
    }

    // --- Hàm 5: Cập nhật Tóm tắt đơn hàng ---
    function updateSummary() {
        let subtotal = 0;
        let selectedItemCount = 0;

        cart.forEach(item => {
            if (item.selected) {
                subtotal += parseFloat(item.price.replace('$', '')) * item.quantity;
                selectedItemCount += item.quantity;
            }
        });

        const shipping = subtotal > 0 ? SHIPPING_FEE : 0.00;
        const total = subtotal + shipping;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        shippingEl.textContent = `$${shipping.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
        itemCountEl.textContent = selectedItemCount;
    }

    // --- Hàm 6: Cập nhật trạng thái checkbox "Chọn Tất Cả" ---
    function updateSelectAllCheckboxState() {
        if (cart.length > 0 && cart.every(item => item.selected)) {
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.checked = false;
        }
    }

    // --- Hàm 7: Gán sự kiện cho các nút (dùng Event Delegation) ---
    function addCartEventListeners() {
        
        // Sự kiện cho "Chọn Tất Cả"
        selectAllCheckbox.onchange = (e) => {
            const isChecked = e.target.checked;
            cart.forEach(item => item.selected = isChecked);
            saveCart();
            renderCart();
        };

        // Sự kiện cho các nút trong bảng (Tăng, Giảm, Xóa, Checkbox)
        cartItemsBody.onclick = (e) => {
            const target = e.target;
            const itemElement = target.closest('.cart-item');
            if (!itemElement) return;
            
            const id = itemElement.dataset.id;
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex === -1) return;

            // Bấm nút TĂNG
            if (target.classList.contains('plus')) {
                cart[itemIndex].quantity++;
                saveCart();
                renderCart();
            }
            
            // Bấm nút GIẢM
            else if (target.classList.contains('minus')) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    // Nếu số lượng là 1, xóa luôn
                    cart.splice(itemIndex, 1);
                }
                saveCart();
                renderCart();
            }
            
            // Bấm nút XÓA
            else if (target.closest('.remove-btn')) {
                cart.splice(itemIndex, 1);
                saveCart();
                renderCart();
            }
            
            // Bấm CHECKBOX
            else if (target.classList.contains('product-checkbox')) {
                cart[itemIndex].selected = target.checked;
                saveCart();
                // Chỉ cần cập nhật tổng tiền và nút "Select All", không cần render lại toàn bộ
                updateSummary();
                updateSelectAllCheckboxState();
            }
        };

        // Nút Thanh Toán
        checkoutBtn.onclick = () => {
            const itemsToCheckout = cart.filter(item => item.selected);
            if (itemsToCheckout.length === 0) {
                alert('Bạn chưa chọn sản phẩm nào để thanh toán!');
                return;
            }
            alert(`Sắp chuyển đến trang thanh toán với ${itemsToCheckout.length} loại sản phẩm.`);
            // window.location.href = '../checkout/checkout.html';
        };
    }

    // --- Chạy lần đầu khi tải trang ---
    loadCart();

});