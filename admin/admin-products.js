import { apiRequest } from "../common/common.js";

async function fetchProducts() {
  return await apiRequest({
    url: "goods",
    method: "GET",
    onError: (err) => {
      console.error("Error fetching products by type:", err);
      alert("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
}

async function createProducts(name, typeId, price, amount, image) {
  return await apiRequest({
    url: "goods/create",
    method: "POST",
    data: {
      name,
      typeId,
      price,
      amount,
      image,
    },
    onSuccess: () => {
      alert("Tạo sản phẩm thành công!");
    },
    onError: (err) => {
      console.error("Error creating products:", err);
      alert("Lỗi khi tạo sản phẩm. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
}

async function deleteProducts(goodsId) {
  return await apiRequest({
    url: "goods/delete",
    method: "POST",
    data: {
      goodsId,
    },
    onSuccess: () => {
      alert("Xóa sản phẩm thành công!");
    },
    onError: (err) => {
      console.error("Error deleting products:", err);
      alert("Lỗi khi xóa sản phẩm. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
}

async function updateProducts(id, goodName, type, price, amount, image) {
  return await apiRequest({
    url: "goods/update",
    method: "POST",
    data: {
      id,
      goodName,
      type,
      price,
      amount,
      image,
    },
    onSuccess: () => {
      alert("Cập nhật sản phẩm thành công!");
    },
    onError: (err) => {
      console.error("Error updating products:", err);
      alert("Lỗi khi cập nhật sản phẩm. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
}

async function showProductList() {
  const productTableContent = document.getElementById("product-table-body");
  const products = await fetchProducts();
  if (!products || products.length === 0) {
    productTableContent.innerHTML =
      "<tr><td colspan='6'>No products found.</td></tr>";
    return;
  }
  let tableContent = "";
  let id = 1;
  products.reverse().forEach((prod) => {
    id = id + 1;
    tableContent += `
        <tr>
            <td>${id}</td>
            <td><img src="${prod.image}" alt="${
      prod.goodName
    }" width="50" style="border-radius:50%"/></td>
            <td>${prod.goodName}</td>
            <td>${prod.type}</td>
            <td>${prod.price.toLocaleString("en-US")}đ</td>
            <td>${prod.amount}</td>
            <td>
                <button class="btn-edit" id="product-edit-${
                  prod.id
                }">Edit</button>
                <button class="btn-delete" id="product-delete-${
                  prod.id
                }">Delete</button>
            </td>
        </tr>
 `;
  });

  productTableContent.innerHTML = tableContent;

  // Xử lý sự kiện cho nút xóa và sửa
  const modal = document.getElementById("product-modal");
  const nameInput = document.getElementById("p-name");
  const typeIdInput = document.getElementById("p-category");
  const priceInput = document.getElementById("p-price");
  const amountInput = document.getElementById("p-stock");
  const imageInput = document.getElementById("p-image");

  products.forEach((prod) => {
    const deleteBtn = document.getElementById(`product-delete-${prod.id}`);
    const editBtn = document.getElementById(`product-edit-${prod.id}`);

    deleteBtn.addEventListener("click", async () => {
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
        await deleteProducts(prod.id);
        await showProductList();
      }
    });
    editBtn.addEventListener("click", async () => {
      nameInput.value = prod.goodName;
      typeIdInput.value = `${prod.type}`;
      priceInput.value = prod.price;
      amountInput.value = prod.amount;
      imageInput.value = prod.image;

      const createBtn = document.getElementById("save-product-btn");
      const updateProductBtn = document.getElementById("update-product-btn");
      createBtn.style.display = "none"; // Ẩn nút thêm mới khi cập nhât sản phẩm
      updateProductBtn.style.display = "block"; // Hiện nút cập nhật khi sửa sản phẩm
      modal.style.display = "flex";
      modal.dataset.editingProductId = prod.id; // Lưu ID sản phẩm đang sửa
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Lấy các phần tử
  const modal = document.getElementById("product-modal");
  const btnAdd = document.getElementById("btn-add-product");
  const btnClose = document.querySelector(".close-modal");
  const productForm = document.getElementById("product-form");
  const saveProductBtn = document.getElementById("save-product-btn");
  const updateProductBtn = document.getElementById("update-product-btn");
  let logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", logout);

  function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "/login/login.html";
  }
  // Hiển thị danh sách sản phẩm ban đầu
  await showProductList();

  // Xử lý lưu sản phẩm
  saveProductBtn.addEventListener("click", async () => {
    const name = document.getElementById("p-name").value;
    const typeId = parseInt(document.getElementById("p-category").value);
    const price = parseFloat(document.getElementById("p-price").value);
    const amount = parseInt(document.getElementById("p-stock").value);
    const image = document.getElementById("p-image").value;
    await createProducts(name, typeId, price, amount, image);
    modal.style.display = "none";
    productForm.reset();
    await showProductList();
  });

  updateProductBtn.addEventListener("click", async () => {
    const name = document.getElementById("p-name").value;
    const typeId = parseInt(document.getElementById("p-category").value);
    const price = parseFloat(document.getElementById("p-price").value);
    const amount = parseInt(document.getElementById("p-stock").value);
    const image = document.getElementById("p-image").value;
    const goodsId = parseInt(modal.dataset.editingProductId);
    await updateProducts(goodsId, name, typeId, price, amount, image);
    modal.style.display = "none";
    productForm.reset();
    await showProductList();
  });

  // --- 1. XỬ LÝ MODAL ---

  // Mở Modal khi bấm nút "Thêm sản phẩm"
  btnAdd.addEventListener("click", () => {
    updateProductBtn.style.display = "none"; // Ẩn nút cập nhật khi thêm sản phẩm mới
    saveProductBtn.style.display = "block"; // Hiện nút lưu khi thêm sản phẩm mới
    modal.style.display = "flex";
  });

  // Đóng Modal khi bấm dấu X
  btnClose.addEventListener("click", () => {
    modal.style.display = "none";
    productForm.reset();
  });

  // Đóng Modal khi bấm ra ngoài vùng trắng
  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
      productForm.reset();
    }
  });
});
