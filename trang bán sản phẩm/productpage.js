document.addEventListener('DOMContentLoaded', () => {

    // --- 1. XỬ LÝ ĐÓNG/MỞ SIDEBAR ---
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
    }

    // --- 2. XỬ LÝ LỌC SẢN PHẨM ---
    const applyFilterBtn = document.getElementById('apply-filter');
    const allProducts = document.querySelectorAll('.product-card');
    const allCheckboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');

    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', () => {
            const selectedFilters = Array.from(allCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.dataset.filter);

            allProducts.forEach(product => {
                const productCategories = product.dataset.category.split(' ');
                const isMatch = selectedFilters.length === 0 || 
                                productCategories.some(cat => selectedFilters.includes(cat));
                
                // Thay vì ẩn/hiện, ta ẩn/hiện thẻ <a> cha
                const linkWrapper = product.closest('.product-link-wrapper');
                if (linkWrapper) {
                    linkWrapper.style.display = isMatch ? 'block' : 'none';
                }
            });
        });
    }

    // --- 3. XỬ LÝ NÚT YÊU THÍCH ---
    document.querySelectorAll('.btn-heart').forEach(button => {
        button.addEventListener('click', (e) => {
            // Ngăn thẻ <a> cha mở link khi bấm nút tim
            e.preventDefault(); 
            
            button.classList.toggle('active');
            const icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        });
    });
    
    // Ngăn chặn bấm vào 2 nút còn lại
    document.querySelectorAll('.btn-add-cart, .btn-share').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn thẻ <a> cha mở link
            // (Thêm logic giỏ hàng/chia sẻ sau)
            alert('Chức năng đang phát triển!');
        });
    });

});