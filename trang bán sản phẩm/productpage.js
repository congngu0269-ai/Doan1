/*
* ===========================================
* FILE JAVASCRIPT HOÀN CHỈNH CHO TRANG SẢN PHẨM
* ===========================================
*/

// Chạy code khi toàn bộ cây HTML đã được tải
document.addEventListener('DOMContentLoaded', () => {

    // --- Biến Toàn cục ---
    const body = document.querySelector('body');
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Tải giỏ hàng từ bộ nhớ

    // ===========================================
    // === 1. LOGIC GIỎ HÀNG TRƯỢT (ƯU TIÊN HÀNG ĐẦU) ===
    // ===========================================

    // Tìm các phần tử của giỏ hàng
    const cartIcon = document.getElementById('cart-icon-btn');
    const closeCartBtn = document.querySelector('.btn-close-cart');
    const listCartHTML = document.querySelector('.list-cart');
    const cartCountSpan = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.querySelector('.btn-checkout');

    // Hàm Mở/Đóng (Bật/Tắt class 'showCart' trên body)
    function toggleCart() {
        body.classList.toggle('showCart');
    }

    // Hàm Lưu giỏ hàng vào localStorage
    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Hàm "Vẽ" lại giỏ hàng (Hiển thị các sản phẩm)
    function renderCart() {
        // Kiểm tra nếu các phần tử HTML không tồn tại thì dừng lại
        if (!listCartHTML || !cartTotalPrice || !cartCountSpan) {
            console.error("Lỗi: Không tìm thấy các thành phần HTML của giỏ hàng.");
            return;
        }

        listCartHTML.innerHTML = ''; // Xóa sản phẩm cũ
        let totalQuantity = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            listCartHTML.innerHTML = '<p class="cart-empty-msg">Giỏ hàng của bạn đang trống.</p>';
        } else {
            cart.forEach(item => {
                const itemPriceNum = parseFloat(item.price.replace('$', ''));
                const itemTotalPrice = itemPriceNum * item.quantity;
                totalQuantity += item.quantity;
                totalPrice += itemTotalPrice;

                let newItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="info">
                        <h4>${item.name}</h4>
                        <span class="price">${item.price}</span>
                    </div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus">+</span>
                    </div>
                    <button class="remove"><i class="fas fa-trash"></i></button>
                </div>
                `;
                listCartHTML.innerHTML += newItemHTML;
            });
        }
        
        cartTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
        cartCountSpan.innerText = totalQuantity;
    }

    // Hàm cập nhật số lượng (tăng, giảm, xóa)
    function updateCartItem(id, action) {
        let itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex === -1) return;

        if (action === 'plus') {
            cart[itemIndex].quantity++;
        } else if (action === 'minus') {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            } else {
                cart.splice(itemIndex, 1); // Xóa nếu giảm về 0
            }
        } else if (action === 'remove') {
            cart.splice(itemIndex, 1);
        }

        saveCartToStorage();
        renderCart();
    }

    // --- Gán sự kiện cho các nút của giỏ hàng ---
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCart);
    }
    
    // Gán sự kiện cho Tăng/Giảm/Xóa (dùng event delegation)
    if (listCartHTML) {
        listCartHTML.addEventListener('click', (e) => {
            let clickedEl = e.target;
            let itemDiv = clickedEl.closest('.cart-item');
            if (!itemDiv) return;
            let productId = itemDiv.dataset.id;
    
            if (clickedEl.classList.contains('plus')) {
                updateCartItem(productId, 'plus');
            } else if (clickedEl.classList.contains('minus')) {
                updateCartItem(productId, 'minus');
            } else if (clickedEl.closest('.remove')) {
                updateCartItem(productId, 'remove');
            }
        });
    }

    // Nút Thanh Toán
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống!');
                return;
            }
            alert('Chuyển đến trang thanh toán!');
            // (Sau này bạn sẽ sửa dòng dưới)
            // window.location.href = '../checkout/checkout.html';
        });
    }

    // Chạy renderCart() ngay khi tải trang để hiển thị giỏ hàng đã lưu
    renderCart();

    // ===========================================
    // === 2. LOGIC SIDEBAR BỘ LỌC ===
    // ===========================================
    const pageContainer = document.querySelector('.page-container');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const openSidebarBtn = document.getElementById('open-filter-btn');
    
    if (closeSidebarBtn && openSidebarBtn && pageContainer) {
        closeSidebarBtn.addEventListener('click', () => {
            pageContainer.classList.add('sidebar-closed');
        });
        openSidebarBtn.addEventListener('click', () => {
            pageContainer.classList.remove('sidebar-closed');
        });
        closeSidebarBtn.style.cursor = 'pointer';
        closeSidebarBtn.title = "Bấm để thu gọn bộ lọc";
    }

    // ===========================================
    // === 3. LOGIC LỌC SẢN PHẨM ===
    // ===========================================
    const applyFilterBtn = document.getElementById('apply-filter');
    const allProducts = document.querySelectorAll('.product-card');
    const allCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');

    if (applyFilterBtn && allProducts.length > 0 && allCheckboxes.length > 0) {
        applyFilterBtn.addEventListener('click', () => {
            const selectedFilters = Array.from(allCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.dataset.filter);

            allProducts.forEach(product => {
                const productCategories = product.dataset.category.split(' ');
                const isMatch = selectedFilters.length === 0 || 
                                productCategories.some(cat => selectedFilters.includes(cat));
                
                const linkWrapper = product.closest('.product-link-wrapper');
                if (linkWrapper) {
                    linkWrapper.style.display = isMatch ? 'block' : 'none';
                }
            });
        });
    }

    // ===========================================
    // === 4. LOGIC CÁC NÚT TRÊN THẺ SẢN PHẨM ===
    // ===========================================
    
    // Nút Yêu thích
    document.querySelectorAll('.btn-heart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            button.classList.toggle('active');
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        });
    });
    
    // Nút "Add To Cart" (trên thẻ sản phẩm)
    document.querySelectorAll('.product-card .btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            // Nâng cấp: Thay vì chuyển trang, chúng ta thêm hàng và mở giỏ
            
            // 1. Lấy ID
            const linkWrapper = button.closest('.product-link-wrapper');
            const productId = linkWrapper.href.split('id=')[1];
            
            // 2. Kiểm tra xem file data.js đã được nạp chưa
            if (typeof productsDB === 'undefined') {
                alert('Lỗi: Không thể thêm nhanh. Vui lòng vào trang chi tiết sản phẩm.');
                window.location.href = linkWrapper.href; // Quay về cách cũ
                return;
            }

            // 3. Tra cứu data
            const productData = productsDB[productId];
            if (!productData) {
                alert('Lỗi: Không tìm thấy thông tin sản phẩm!');
                return;
            }

            // 4. Thêm vào giỏ hàng (logic copy từ product-detail.js)
            const existingItemIndex = cart.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productData.name,
                    price: productData.price,
                    image: productData.mainImage,
                    quantity: 1
                });
            }

            // 5. Lưu, Cập nhật và Mở giỏ hàng
            saveCartToStorage();
            renderCart();
            body.classList.add('showCart');
        });
    });

    // Nút Chia sẻ
    document.querySelectorAll('.btn-share').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            alert('Chức năng "Chia sẻ" đang phát triển!');
        });
    });

});