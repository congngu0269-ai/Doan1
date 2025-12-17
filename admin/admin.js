let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");

sidebarBtn.onclick = function() {
  sidebar.classList.toggle("active");
  if(sidebar.classList.contains("active")){
    sidebarBtn.classList.replace("bx-menu" ,"bx-menu-alt-right");
  }else
    sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
}

// === QUẢN LÝ TAB (ĐÃ SỬA LỖI) ===
function switchTab(tabId, element) {
    // 1. Ngăn chặn hành vi mặc định của thẻ 'a' (tránh load lại trang hoặc nhảy lên đầu)
    if(event) event.preventDefault();

    // 2. Ẩn tất cả nội dung các tab
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');

    // 3. Hiện tab được chọn
    const selectedTab = document.getElementById(tabId);
    if(selectedTab) {
        selectedTab.style.display = 'block';
    }

    // 4. Xử lý class 'active' cho Menu Sidebar
    // BƯỚC QUAN TRỌNG: Tìm tất cả các thẻ <a> trong sidebar và xóa class active
    const allLinks = document.querySelectorAll('.sidebar .nav-links li a');
    allLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Thêm class active cho thẻ <a> vừa được click (element)
    if(element) {
        element.classList.add('active');
    }
}

// === QUẢN LÝ SẢN PHẨM (GIẢ LẬP) ===
// Khởi tạo dữ liệu mẫu nếu chưa có
let products = JSON.parse(localStorage.getItem('adminProducts')) || [
    { id: 1, name: "Chậu Hoa Mèo", price: "325.000", stock: 10, img: "https://via.placeholder.com/50" },
    { id: 2, name: "Bó Hoa Tulip", price: "499.000", stock: 5, img: "https://via.placeholder.com/50" }
];

const productBody = document.getElementById('product-list-body');
const modal = document.getElementById('productModal');

// Hàm render bảng sản phẩm
function renderProducts() {
    if(!productBody) return; // Kiểm tra nếu không ở tab sản phẩm thì bỏ qua
    productBody.innerHTML = '';
    products.forEach((prod, index) => {
        let row = `
            <tr>
                <td>#${prod.id}</td>
                <td><img src="${prod.img}" alt=""></td>
                <td>${prod.name}</td>
                <td>${prod.price}đ</td>
                <td>${prod.stock}</td>
                <td>
                    <button class="btn-action edit"><i class='bx bx-edit'></i></button>
                    <button class="btn-action delete" onclick="deleteProduct(${index})"><i class='bx bx-trash'></i></button>
                </td>
            </tr>
        `;
        productBody.innerHTML += row;
    });
}

// Hàm thêm sản phẩm
const addForm = document.getElementById('addProductForm');
if(addForm) {
    addForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('prodName').value;
        const price = document.getElementById('prodPrice').value;
        const stock = document.getElementById('prodStock').value;
        const img = document.getElementById('prodImg').value || "https://via.placeholder.com/50";

        const newProd = {
            id: products.length + 1,
            name: name,
            price: price,
            stock: stock,
            img: img
        };

        products.push(newProd);
        localStorage.setItem('adminProducts', JSON.stringify(products)); // Lưu vào localStorage
        renderProducts();
        closeModal();
        this.reset();
    });
}

// Hàm xóa sản phẩm
function deleteProduct(index) {
    if(confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
        products.splice(index, 1);
        localStorage.setItem('adminProducts', JSON.stringify(products));
        renderProducts();
    }
}

// Modal functions
function openModal() {
    if(modal) modal.style.display = "flex";
}

function closeModal() {
    if(modal) modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Chạy lần đầu khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    // Mặc định hiển thị tab Dashboard nếu chưa chọn gì
    // (CSS đã set display:block cho dashboard, nên JS này chỉ để render data nếu cần)
    renderProducts();
});