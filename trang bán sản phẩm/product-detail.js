document.addEventListener('DOMContentLoaded', () => {

    // === 1. LẤY ID SẢN PHẨM TỪ URL ===
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // === 2. TÌM DỮ LIỆU SẢN PHẨM ===
    // (productsDB được lấy từ file data.js đã link ở HTML)
    
    // Kiểm tra xem productsDB có tồn tại không (phòng khi data.js tải lỗi)
    if (typeof productsDB === 'undefined') {
        console.error('Lỗi: File data.js chưa được tải hoặc biến productsDB không tồn tại.');
        return; // Dừng chạy code
    }

    const productData = productsDB[productId];

    // === 3. BƠM (INJECT) DỮ LIỆU VÀO TRANG ===
    if (productData) {
        // Cập nhật tiêu đề trang
        document.title = `${productData.name} - HM Shop`;

        // Cập nhật thông tin chính
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

        // Cập nhật ảnh chính
        document.getElementById('main-product-image').src = productData.mainImage;

        // Cập nhật ảnh thumbnail
        const thumbnailContainer = document.getElementById('product-thumbnails');
        thumbnailContainer.innerHTML = ''; // Xóa ảnh mẫu
        productData.thumbnails.forEach((thumbSrc, index) => {
            const img = document.createElement('img');
            img.src = thumbSrc;
            img.alt = `Thumbnail ${index + 1}`;
            img.classList.add('thumbnail-img');
            if (index === 0) {
                img.classList.add('active'); // Kích hoạt ảnh đầu tiên
            }
            thumbnailContainer.appendChild(img);
        });

        // Cập nhật mô tả
        const descSection = document.getElementById('product-description');
        // Xóa nội dung "Đang tải" cũ (nếu có) và thêm mô tả mới
        descSection.innerHTML = `<h2>Mô Tả Sản Phẩm</h2>` + productData.description;

    } else {
        // Nếu không tìm thấy ID sản phẩm, báo lỗi và DỪNG LẠI
        document.querySelector('.product-detail-container').innerHTML = 
            `<h1>Lỗi: Không tìm thấy sản phẩm.</h1> <p>Vui lòng quay lại trang sản phẩm và thử lại.</p>`;
        
        // Dừng hàm tại đây để không chạy code bên dưới
        return; 
    }


    // =======================================================
    // CODE BÊN DƯỚI SẼ CHỈ CHẠY NẾU productData TỒN TẠI
    // =======================================================

    // === 4. LOGIC CỘNG/TRỪ SỐ LƯỢNG ===
    const qtyInput = document.getElementById('qty-input');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyMinus = document.getElementById('qty-minus');

    if (qtyInput && qtyPlus && qtyMinus) {
        qtyPlus.addEventListener('click', () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) {
                qtyInput.value = val - 1;
            }
        });
        qtyInput.addEventListener('change', () => {
            if (parseInt(qtyInput.value) < 1 || !qtyInput.value) {
                qtyInput.value = 1;
            }
        });
    }

    // --- XỬ LÝ THƯ VIỆN ẢNH ---
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

    // === 5. LOGIC THÊM VÀO GIỎ HÀNG ===
    const addToCartButton = document.querySelector('.btn-add-to-cart');
    
    if (addToCartButton) {
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

            // 5. Thông báo cho người dùng
            alert(`Đã thêm ${itemToAdd.quantity} "${itemToAdd.name}" vào giỏ hàng!`);
        });
    }
});