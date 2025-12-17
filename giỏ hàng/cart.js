document.addEventListener('DOMContentLoaded', () => {
    

    const cartItemsBody = document.getElementById('cart-items-body');
    const emptyCartMsg = document.getElementById('cart-empty-message');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    // tom tat
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');
    const itemCountEl = document.getElementById('summary-item-count');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
//    voucher
    const voucherInput = document.getElementById('voucher-input');
    const applyVoucherBtn = document.querySelector('.btn-apply-voucher');
    const discountRow = document.getElementById('discount-row');
    const discountEl = document.getElementById('summary-discount');

    const SHIPPING_FEE = 30000;
    let cart = []; 
    let currentDiscount = 0; 


    function parsePrice(price) {
        if (typeof price === 'number') return price;
        if (!price) return 0;
        
        const numberString = price.toString().replace(/[^0-9]/g, '');
        return parseInt(numberString) || 0;
    }

    function loadCart() {
        let cartFromStorage = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cartFromStorage.map(item => ({
            ...item,
            selected: item.selected !== undefined ? item.selected : true
        }));
        renderCart();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

  
    function renderCart() {
        if (!cartItemsBody) return; 

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

        const shipping = selectedItemCount > 0 ? SHIPPING_FEE : 0;
        

        let total = subtotal + shipping - currentDiscount;
        if (total < 0) total = 0;

        if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString('vi-VN') + ' ₫';
        if (shippingEl) shippingEl.textContent = shipping.toLocaleString('vi-VN') + ' ₫';
        if (totalEl) totalEl.textContent = total.toLocaleString('vi-VN') + ' ₫';
        if (itemCountEl) itemCountEl.textContent = selectedItemCount;

        if (discountRow && discountEl) {
            if (currentDiscount > 0) {
                discountRow.style.display = 'flex';
                discountEl.textContent = '-' + currentDiscount.toLocaleString('vi-VN') + ' ₫';
            } else {
                discountRow.style.display = 'none';
            }
        }
    }
// checkbox
    function updateSelectAllCheckboxState() {
        if (!selectAllCheckbox) return;
        if (cart.length > 0 && cart.every(item => item.selected)) {
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.checked = false;
        }
    }

    // end checkbox
// event

    if (cartItemsBody) {
        cartItemsBody.addEventListener('click', (e) => {
            const target = e.target;
            const itemElement = target.closest('.cart-item');
            if (!itemElement) return;
            
            const id = itemElement.dataset.id;
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex === -1) return;

    //    tang
            if (target.classList.contains('plus')) {
                cart[itemIndex].quantity++;
                saveCart(); renderCart();
            }
        //  giam
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
            // delete
            else if (target.closest('.remove-btn')) {
                if (confirm("Xóa sản phẩm khỏi giỏ hàng?")) {
                    cart.splice(itemIndex, 1);
                }
                saveCart(); renderCart();
            }
            // check box
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


    if (applyVoucherBtn && voucherInput) {
        applyVoucherBtn.addEventListener('click', () => {
            const code = voucherInput.value.trim().toUpperCase();
            

            if (code === "") {
                 alert("Vui lòng nhập mã giảm giá!");
                 updateSummary();
                 return;
            }

            if (code === "HMSHOP10") { 
                currentDiscount = 10000; 
                alert("Áp dụng mã giảm giá 10.000đ thành công!");
            } else if (code === "FREESHIP") { 

                let subtotalCheck = 0;
                cart.forEach(item => {
                    if (item.selected) {
                        subtotalCheck += parsePrice(item.price) * item.quantity;
                    }
                });
                
                if (subtotalCheck > 0) {
                     currentDiscount = 30000; 
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
            

            let subtotal = 0;
            itemsToCheckout.forEach(item => {
                subtotal += parsePrice(item.price) * item.quantity;
            });
            
            const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
            let total = subtotal + shipping - currentDiscount;
            if (total < 0) total = 0;
            
            const totalStr = total.toLocaleString('vi-VN') + ' ₫';

            alert(`Sắp chuyển đến trang thanh toán.\nSố lượng: ${itemsToCheckout.length} sản phẩm.\nTổng thanh toán: ${totalStr}`);
            
            cart = cart.filter(item => !item.selected);
            saveCart();
            
            currentDiscount = 0;
            if (voucherInput) voucherInput.value = "";
            
            window.location.href = "../order/order.html";
        });
    }


    loadCart();
});