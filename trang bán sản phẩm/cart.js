document.addEventListener('DOMContentLoaded', () => {
    
    const cartItemsBody = document.getElementById('cart-items-body');
    const cartItemsList = document.querySelector('.cart-items-list');
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');
    
    // 1. Tải giỏ hàng
    loadCartItems();

    function loadCartItems() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItemsBody.innerHTML = ''; // Xóa nội dung cũ

        if (cart.length === 0) {
            cartItemsList.classList.add('empty');
            updateSummary(0); // Cập nhật tổng tiền là 0
            return;
        }

        cartItemsList.classList.remove('empty');
        let currentSubtotal = 0;

        cart.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('$', ''));
            const itemSubtotal = itemPrice * item.quantity;
            currentSubtotal += itemSubtotal;

            const row = document.createElement('tr');
            row.classList.add('cart-item');
            row.dataset.id = item.id;
            
            row.innerHTML = `
                <td class="item-image"><img src="${item.image}" alt="${item.name}"></td>
                <td class="item-name">${item.name}</td>
                <td class="item-price">${item.price}</td>
                <td class="item-quantity">
                    <input type="number" value="${item.quantity}" min="1" class="qty-input">
                </td>
                <td class="item-subtotal">$${itemSubtotal.toFixed(2)}</td>
                <td class="item-remove">
                    <button class="remove-btn"><i class="fas fa-trash"></i></button>
                </td>
            `;
            cartItemsBody.appendChild(row);
        });

        updateSummary(currentSubtotal);
        addCartEventListeners(); // Thêm listener sau khi tạo nút
    }

    // 2. Cập nhật Tổng tiền
    function updateSummary(subtotal) {
        const shipping = subtotal > 0 ? 5.00 : 0.00; // 5$ phí ship, nếu không có hàng thì 0$
        const total = subtotal + shipping;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        shippingEl.textContent = `$${shipping.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    // 3. Thêm các sự kiện (Xóa, Sửa số lượng)
    function addCartEventListeners() {
        // Nút Xóa
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToRemove = e.target.closest('.cart-item').dataset.id;
                removeItemFromCart(idToRemove);
            });
        });

        // Thay đổi số lượng
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const idToUpdate = e.target.closest('.cart-item').dataset.id;
                const newQuantity = parseInt(e.target.value);
                if (newQuantity < 1) newQuantity = 1; // Ngăn số lượng âm
                updateItemQuantity(idToUpdate, newQuantity);
            });
        });
    }

    // 4. Các hàm xử lý LocalStorage
    function removeItemFromCart(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems(); // Tải lại giỏ hàng
    }

    function updateItemQuantity(id, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity = quantity;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems(); // Tải lại giỏ hàng
    }

});