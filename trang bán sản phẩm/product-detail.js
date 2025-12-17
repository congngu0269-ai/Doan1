document.addEventListener('DOMContentLoaded', () => {


    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

// check
    if (typeof productsDB === 'undefined') {
        console.error('Lỗi: Không tìm thấy biến productsDB. Hãy kiểm tra file data.js.');
        alert('Lỗi hệ thống: Không tải được dữ liệu sản phẩm.');
        return;
    }

// tim kiem
    const productData = productsDB[productId];

// hien thi
    if (productData) {
        document.title = `${productData.name} - HM Shop`;
        const nameEl = document.getElementById('product-name');
        const priceEl = document.getElementById('product-price');
        const oldPriceEl = document.getElementById('product-old-price');
        const discountEl = document.getElementById('product-discount');

        if(nameEl) nameEl.textContent = productData.name;
        if(priceEl) priceEl.textContent = productData.price;
        if (productData.oldPrice && oldPriceEl) {
            oldPriceEl.textContent = productData.oldPrice;
            oldPriceEl.style.display = 'inline';
        } else if (oldPriceEl) {
            oldPriceEl.style.display = 'none';
        }
        if (productData.discount && discountEl) {
            discountEl.textContent = productData.discount;
            discountEl.style.display = 'inline-block';
        } else if (discountEl) {
            discountEl.style.display = 'none';
        }
        const mainImgEl = document.getElementById('main-product-image');
        if(mainImgEl) mainImgEl.src = productData.mainImage;
        const thumbnailContainer = document.getElementById('product-thumbnails');
        if (thumbnailContainer && productData.thumbnails) {
            thumbnailContainer.innerHTML = ''; // Xóa ảnh mẫu cũ
            productData.thumbnails.forEach((thumbSrc, index) => {
                const img = document.createElement('img');
                img.src = thumbSrc;
                img.alt = `Thumbnail ${index + 1}`;
                img.classList.add('thumbnail-img');
                if (index === 0) img.classList.add('active'); 
                img.addEventListener('click', function() {
                    mainImgEl.src = this.src;
                    document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });

                thumbnailContainer.appendChild(img);
            });
        }

        const descSection = document.getElementById('product-description');
        if (descSection) {

            descSection.innerHTML = `<h2>Mô Tả Sản Phẩm</h2>` + productData.description;
        }

    } else {

        const container = document.querySelector('.product-detail-container');
        if(container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 5rem; width: 100%;">
                    <h1>⚠️ Không tìm thấy sản phẩm!</h1>
                    <p>Có vẻ như đường dẫn bị sai hoặc sản phẩm không tồn tại.</p>
                    <a href="../productpage.html" class="btn-main" style="display:inline-block; margin-top:20px; text-decoration:none;">Quay lại Cửa Hàng</a>
                </div>
            `;
        }
    }



//   tang giam
   

    const qtyInput = document.getElementById('qty-input');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyMinus = document.getElementById('qty-minus');
    const addToCartBtn = document.querySelector('.btn-add-to-cart');

// tang
    if (qtyInput && qtyPlus && qtyMinus) {
        qtyPlus.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) qtyInput.value = val - 1;
        });
    }

// them
    if (addToCartBtn && productData) {
        addToCartBtn.addEventListener('click', () => {
            const itemToAdd = {
                id: productId,
                name: productData.name,
                price: productData.price,
                image: productData.mainImage,
                quantity: parseInt(qtyInput.value)
            };
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += itemToAdd.quantity;
            } else {
                cart.push(itemToAdd);
            }
// luu
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`Đã thêm ${itemToAdd.quantity} sản phẩm vào giỏ hàng!`);
        });
    }
}); 