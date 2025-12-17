
document.addEventListener('DOMContentLoaded', () => {

    const body = document.querySelector('body');
    let cart = JSON.parse(localStorage.getItem('cart')) || []; 

    // Tìm các phần tử của giỏ hàng
    const cartIcon = document.getElementById('cart-icon-btn');
    const closeCartBtn = document.querySelector('.btn-close-cart');
    const listCartHTML = document.querySelector('.list-cart');
    const cartCountSpan = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.querySelector('.btn-checkout');

    //open/close
    function toggleCart() {
        body.classList.toggle('showCart');
    }

    // save
    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }


    function renderCart() {
// kiem tra san pham 
        if (!listCartHTML || !cartTotalPrice || !cartCountSpan) {
            console.error("Lỗi: Không tìm thấy các thành phần HTML của giỏ hàng.");
            return;
        }

        listCartHTML.innerHTML = '';
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

    // ham tang giam xoa
    function updateCartItem(id, action) {
        let itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex === -1) return;

        if (action === 'plus') {
            cart[itemIndex].quantity++;
        } else if (action === 'minus') {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            } else {
                cart.splice(itemIndex, 1); 
            }
        } else if (action === 'remove') {
            cart.splice(itemIndex, 1);
        }

        saveCartToStorage();
        renderCart();
    }

 
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCart);
    }
    
//    gan su kiẹn tang giam
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

//   thanh toan
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống!');
                return;
            }
            alert('Chuyển đến trang thanh toán!');
        });
    }

    renderCart();

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

    // loc san pham 

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

    document.querySelectorAll('.btn-heart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            button.classList.toggle('active');
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        });
    });
    
// add to cart
    document.querySelectorAll('.product-card .btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const linkWrapper = button.closest('.product-link-wrapper');
            const productId = linkWrapper.href.split('id=')[1];
            if (typeof productsDB === 'undefined') {
                alert('Lỗi: Không thể thêm nhanh. Vui lòng vào trang chi tiết sản phẩm.');
                window.location.href = linkWrapper.href; 
                return;
            }
// check data
            const productData = productsDB[productId];
            if (!productData) {
                alert('Lỗi: Không tìm thấy thông tin sản phẩm!');
                return;
            }

            //  them vao gio hang
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

//  luu va cap nhat
            saveCartToStorage();
            renderCart();
            body.classList.add('showCart');
        });
    });

// share
    document.querySelectorAll('.btn-share').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            alert('Chức năng "Chia sẻ" đang phát triển!');
        });
    });

});