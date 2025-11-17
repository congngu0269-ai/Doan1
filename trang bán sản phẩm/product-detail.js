document.addEventListener('DOMContentLoaded', () => {

    // === 1. LẤY ID SẢN PHẨM TỪ URL ===
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Ví dụ: "cat-pot"

    // === 2. TÌM DỮ LIỆU SẢN PHẨM ===
    const productData = productsDB[productId]; // (Lấy từ data.js)

    // === 3. BƠM (INJECT) DỮ LIỆU VÀO TRANG ===
    if (productData) {
        // ... (Toàn bộ code "bơm" dữ liệu của bạn giữ nguyên ở đây) ...
        // (Cập nhật tên, giá, ảnh, mô tả...)
        document.title = `${productData.name} - HM Shop`;
        document.getElementById('product-name').textContent = productData.name;
        document.getElementById('product-price').textContent = productData.price;
        if (productData.oldPrice) {
            document.getElementById('product-old-price').textContent = productData.oldPrice;
        } else {
            document.getElementById('product-old-price').style.display = 'none';
        }
        if (productData.discount) {
            document.getElementById('product-discount').textContent = productData.discount;
        } else {
            document.getElementById('product-discount').style.display = 'none';
        }
        document.getElementById('main-product-image').src = productData.mainImage;
        const thumbnailContainer = document.getElementById('product-thumbnails');
        thumbnailContainer.innerHTML = ''; 
        productData.thumbnails.forEach((thumbSrc, index) => {
            const img = document.createElement('img');
            img.src = thumbSrc;
            img.alt = `Thumbnail ${index + 1}`;
            img.classList.add('thumbnail-img');
            if (index === 0) img.classList.add('active');
            thumbnailContainer.appendChild(img);
        });
        document.getElementById('product-description').innerHTML += productData.description;
    } else {
        document.querySelector('.product-detail-container').innerHTML = 
            '<h1>Lỗi: Không tìm thấy sản phẩm.</h1>';
    }

    // === 4. GIỮ NGUYÊN LOGIC CŨ ===
    // (Bộ chọn số lượng, gallery ảnh...)
    const qtyInput = document.getElementById('qty-input');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyMinus = document.getElementById('qty-minus');
    if (qtyInput && qtyPlus && qtyMinus) {
        qtyPlus.addEventListener('click', () => qtyInput.value = parseInt(qtyInput.value) + 1);
        qtyMinus.addEventListener('click', () => {
            if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
        });
        qtyInput.addEventListener('change', () => {
            if (parseInt(qtyInput.value) < 1 || !qtyInput.value) qtyInput.value = 1;
        });
    }
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail-img');
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // === 5. LOGIC THÊM VÀO GIỎ HÀNG (MỚI) ===
    const addToCartButton = document.querySelector('.btn-add-to-cart');
    
    if (addToCartButton && productData) {
        addToCartButton.addEventListener('click', () => {
            // 1. Lấy thông tin sản phẩm
            const itemToAdd = {
                id: productId,
                name: productData.name,
                price: productData.price,
                image: productData.mainImage,
                quantity: parseInt(qtyInput.value)
            };

            // 2. Lấy giỏ hàng cũ từ localStorage (hoặc tạo mảng rỗng)
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // 3. Kiểm tra xem sản phẩm đã có trong giỏ chưa
            const existingItemIndex = cart.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                // Nếu đã có, chỉ cập nhật số lượng
                cart[existingItemIndex].quantity += itemToAdd.quantity;
            } else {
                // Nếu chưa có, thêm mới vào giỏ
                cart.push(itemToAdd);
            }

            // 4. Lưu giỏ hàng mới vào localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // 5. Thông báo cho người dùng (có thể làm toast sau)
            alert(`Đã thêm ${itemToAdd.quantity} "${itemToAdd.name}" vào giỏ hàng!`);
        });
    }
});