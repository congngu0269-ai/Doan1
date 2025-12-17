document.addEventListener('DOMContentLoaded', () => {

    // === 1. LẤY ID SẢN PHẨM TỪ URL ===
    // Ví dụ: product-detail.html?id=cat-pot -> productId = "cat-pot"
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // === 2. KIỂM TRA DỮ LIỆU ===
    // Kiểm tra xem file data.js đã được nạp chưa
    if (typeof productsDB === 'undefined') {
        console.error('Lỗi: Không tìm thấy biến productsDB. Hãy kiểm tra file data.js.');
        alert('Lỗi hệ thống: Không tải được dữ liệu sản phẩm.');
        return;
    }

    // Tìm sản phẩm trong kho dữ liệu
    const productData = productsDB[productId];

    // 3. HIỂN THỊ DỮ LIỆU LÊN TRANG 
    if (productData) {
        // Cập nhật tiêu đề tab trình duyệt
        document.title = `${productData.name} - HM Shop`;

        // Cập nhật Tên và Giá
        const nameEl = document.getElementById('product-name');
        const priceEl = document.getElementById('product-price');
        const oldPriceEl = document.getElementById('product-old-price');
        const discountEl = document.getElementById('product-discount');

        if(nameEl) nameEl.textContent = productData.name;
        if(priceEl) priceEl.textContent = productData.price;
        
        // Giá cũ (nếu có)
        if (productData.oldPrice && oldPriceEl) {
            oldPriceEl.textContent = productData.oldPrice;
            oldPriceEl.style.display = 'inline';
        } else if (oldPriceEl) {
            oldPriceEl.style.display = 'none';
        }

        // Giảm giá (nếu có)
        if (productData.discount && discountEl) {
            discountEl.textContent = productData.discount;
            discountEl.style.display = 'inline-block';
        } else if (discountEl) {
            discountEl.style.display = 'none';
        }

        // Cập nhật Ảnh chính
        const mainImgEl = document.getElementById('main-product-image');
        if(mainImgEl) mainImgEl.src = productData.mainImage;

        // Cập nhật Ảnh nhỏ (Thumbnails)
        const thumbnailContainer = document.getElementById('product-thumbnails');
        if (thumbnailContainer && productData.thumbnails) {
            thumbnailContainer.innerHTML = ''; // Xóa ảnh mẫu cũ
            productData.thumbnails.forEach((thumbSrc, index) => {
                const img = document.createElement('img');
                img.src = thumbSrc;
                img.alt = `Thumbnail ${index + 1}`;
                img.classList.add('thumbnail-img');
                if (index === 0) img.classList.add('active'); // Ảnh đầu tiên được chọn
                
                // Sự kiện click vào ảnh nhỏ -> đổi ảnh to
                img.addEventListener('click', function() {
                    mainImgEl.src = this.src;
                    document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });

                thumbnailContainer.appendChild(img);
            });
        }

        // Cập nhật Mô tả
        const descSection = document.getElementById('product-description');
        if (descSection) {
            // Giữ lại tiêu đề h2, thay thế nội dung bên dưới
            descSection.innerHTML = `<h2>Mô Tả Sản Phẩm</h2>` + productData.description;
        }

    } else {
        // TRƯỜNG HỢP KHÔNG TÌM THẤY SẢN PHẨM (ID sai hoặc không có ID)
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



    // CÁC CHỨC NĂNG KHÁC (Tăng/Giảm/Thêm giỏ hàng)
    // (Chỉ chạy khi có dữ liệu sản phẩm)
   

    const qtyInput = document.getElementById('qty-input');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyMinus = document.getElementById('qty-minus');
    const addToCartBtn = document.querySelector('.btn-add-to-cart');

    // 1. Tăng giảm số lượng
    if (qtyInput && qtyPlus && qtyMinus) {
        qtyPlus.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) qtyInput.value = val - 1;
        });
    }

    // 2. Thêm vào giỏ hàng
    if (addToCartBtn && productData) {
        addToCartBtn.addEventListener('click', () => {
            // Tạo đối tượng sản phẩm để lưu
            const itemToAdd = {
                id: productId,
                name: productData.name,
                price: productData.price,
                image: productData.mainImage,
                quantity: parseInt(qtyInput.value)
            };

            // Lấy giỏ hàng cũ từ localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Kiểm tra xem đã có chưa
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += itemToAdd.quantity;
            } else {
                cart.push(itemToAdd);
            }

            // Lưu lại vào localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`Đã thêm ${itemToAdd.quantity} sản phẩm vào giỏ hàng!`);
        });
    }
}); 