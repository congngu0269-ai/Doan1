document.addEventListener('DOMContentLoaded', () => {
    
    // Lấy các phần tử
    const modal = document.getElementById('product-modal');
    const btnAdd = document.getElementById('btn-add-product');
    const btnClose = document.querySelector('.close-modal');
    const productForm = document.getElementById('product-form');

    // --- 1. XỬ LÝ MODAL ---
    
    // Mở Modal khi bấm nút "Thêm sản phẩm"
    btnAdd.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Đóng Modal khi bấm dấu X
    btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Đóng Modal khi bấm ra ngoài vùng trắng
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // --- 2. XỬ LÝ FORM (Giả lập thêm mới) ---
    productForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn load lại trang
        
        alert("Đã lưu sản phẩm thành công! (Đây là giao diện demo)");
        modal.style.display = 'none';
        productForm.reset(); // Xóa dữ liệu trong form
    });

    // --- 3. XỬ LÝ NÚT XÓA ---
    const deleteBtns = document.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
                // Tìm và xóa dòng <tr> chứa nút bấm
                const row = e.target.closest('tr');
                row.remove();
                alert("Đã xóa sản phẩm.");
            }
        });
    });

});