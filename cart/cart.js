import { apiRequest } from "../common/common.js";

let cart = []; // Biến giỏ hàng toàn cục

// --- Hàm 1: Tải giỏ hàng từ LocalStorage ---
async function loadCart() {
  cart = await apiRequest({
    url: "cart/get",
    method: "GET",
    onError: (err) => {
      console.error("Error fetching all cart products:", err);
      alert("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
  renderCart();
}

async function deleteCartProduct(goodsId, amount) {
  await apiRequest({
    url: `cart/delete`,
    method: "POST",
    data: { goodsId, amount },
    onError: (err) => {
      console.error("Error deleting cart product:", err);
      alert("Lỗi khi xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại sau.");
    },
    requireAuth: true,
  });

  await loadCart();
  //   localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Hàm 3: "Vẽ" lại toàn bộ giỏ hàng ---
function renderCart() {
  const cartItemsBody = document.getElementById("cart-items-body");
  const emptyCartMsg = document.getElementById("cart-empty-message");

  cartItemsBody.innerHTML = ""; // Xóa nội dung cũ

  if (cart.length === 0) {
    emptyCartMsg.style.display = "block";
    document.querySelector(".cart-table-header").style.display = "none";
  } else {
    emptyCartMsg.style.display = "none";
    document.querySelector(".cart-table-header").style.display = "grid";

    let cartBody = "";
    cart.forEach((item) => {
      const itemHTML = createCartItemHTML(item);
      cartBody += itemHTML;
    });
    cartItemsBody.innerHTML = cartBody;

    cart.forEach((item) => {
      const removeBtn = document.getElementById(`cart-del-btn-${item.cartId}`);
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          deleteCartProduct(item.goodsId, item.cartAmount);
        });
      }
    });
  }

  updateSummary();
  //   addCartEventListeners(); // Gắn lại sự kiện cho các nút mới
}

//   cartId: number;
//   customerId: number;
//   goodsId: number;
//   name: string;
//   type: number;
//   goodName: string;
//   cartAmount: number;
//   price: number;
//   image: string;
//                 // <input type="checkbox" class="product-checkbox" ${
//   item.selected ? "checked" : ""
// }>
// --- Hàm 4: Tạo HTML cho 1 sản phẩm ---
function createCartItemHTML(item) {
  const itemPrice = item.price;
  const itemSubtotal = (itemPrice * item.cartAmount);

  return `
        <div class="cart-item" data-id="${item.cartId}">
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.goodName}">
                <div>
                    <div class="name">
                        <a href="../product-sales-page/product-detail.html?id=${item.goodsId}">    
                            ${item.goodName}
                        </a>
                    </div>
                </div>
            </div>
            <div class="item-price">${item.price.toLocaleString("en-US")}</div>
            <div class="item-quantity">
                <div class="quantity-selector">
                    <span class="qty-value">${item.cartAmount}</span>
                </div>
            </div>
            <div class="item-subtotal">${itemSubtotal.toLocaleString("en-US")} VND</div>
            <div class="item-action">
                <button class="remove-btn" id="cart-del-btn-${
                  item.cartId
                }"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        `;
}

// --- Hàm 5: Cập nhật Tóm tắt đơn hàng ---
function updateSummary() {
  console.log("Updating summary...");
  const subtotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");
  const itemCountEl = document.getElementById("summary-item-count");
  const SHIPPING_FEE = 500;

  let subtotal = 0;
  let selectedItemCount = 0;
  console.log("Current cart:", cart);
  cart.forEach((item) => {
    subtotal += item.price * item.cartAmount;
    selectedItemCount += item.cartAmount;
  });

  const shipping = subtotal > 0 ? SHIPPING_FEE : 0.0;
  const total = subtotal + shipping;

  subtotalEl.textContent = `${subtotal.toLocaleString("en-US")} VND`;
  shippingEl.textContent = `${shipping.toLocaleString("en-US")} VND`;
  totalEl.textContent = `${total.toLocaleString("en-US")} VND`;
  itemCountEl.textContent = selectedItemCount;
  console.log(
    "subtotal: ",
    subtotal,
    " shipping: ",
    shipping,
    " total: ",
    total
  );
}

// --- Hàm 6: Cập nhật trạng thái checkbox "Chọn Tất Cả" ---
function updateSelectAllCheckboxState() {
  if (cart.length > 0 && cart.every((item) => item.selected)) {
    selectAllCheckbox.checked = true;
  } else {
    selectAllCheckbox.checked = false;
  }
}

// --- Hàm 7: Gán sự kiện cho các nút (dùng Event Delegation) ---
function addCartEventListeners() {
  // Sự kiện cho "Chọn Tất Cả"
  selectAllCheckbox.onchange = (e) => {
    const isChecked = e.target.checked;
    cart.forEach((item) => (item.selected = isChecked));
    saveCart();
    renderCart();
  };

  // Sự kiện cho các nút trong bảng (Tăng, Giảm, Xóa, Checkbox)
  cartItemsBody.onclick = (e) => {
    const target = e.target;
    const itemElement = target.closest(".cart-item");
    if (!itemElement) return;

    const id = itemElement.dataset.id;
    const itemIndex = cart.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    // Bấm nút TĂNG
    if (target.classList.contains("plus")) {
      cart[itemIndex].quantity++;
      saveCart();
      renderCart();
    }

    // Bấm nút GIẢM
    else if (target.classList.contains("minus")) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
      } else {
        // Nếu số lượng là 1, xóa luôn
        cart.splice(itemIndex, 1);
      }
      saveCart();
      renderCart();
    }

    // Bấm nút XÓA
    else if (target.closest(".remove-btn")) {
      cart.splice(itemIndex, 1);
      saveCart();
      renderCart();
    }

    // Bấm CHECKBOX
    else if (target.classList.contains("product-checkbox")) {
      cart[itemIndex].selected = target.checked;
      saveCart();
      // Chỉ cần cập nhật tổng tiền và nút "Select All", không cần render lại toàn bộ
      updateSummary();
      updateSelectAllCheckboxState();
    }
  };

  // Nút Thanh Toán
  checkoutBtn.onclick = () => {
    const itemsToCheckout = cart.filter((item) => item.selected);
    if (itemsToCheckout.length === 0) {
      alert("Bạn chưa chọn sản phẩm nào để thanh toán!");
      return;
    }
    alert(
      `Sắp chuyển đến trang thanh toán với ${itemsToCheckout.length} loại sản phẩm.`
    );
    // window.location.href = '../checkout/checkout.html';
  };
}

async function checkoutCart() {
  await apiRequest({
    url: `cart/pay`,
    method: "POST",
    onError: (err) => {
      console.error("Error processing payment:", err);
      alert("Lỗi khi thanh toán. Vui lòng thử lại sau.", err.message);
    },
    requireAuth: true,
  });
  await loadCart();

}

document.addEventListener("DOMContentLoaded", async () => {
  // --- Lấy các phần tử DOM ---
  const cartItemsBody = document.getElementById("cart-items-body");
  const emptyCartMsg = document.getElementById("cart-empty-message");
  const selectAllCheckbox = document.getElementById("select-all-checkbox");

  // Phần Tóm tắt
  const subtotalEl = document.getElementById("summary-subtotal");
  const shippingEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");
  const itemCountEl = document.getElementById("summary-item-count");
  const checkoutBtn = document.querySelector(".btn-checkout");
  checkoutBtn.addEventListener("click", async () => {
    await checkoutCart();
  });
  // --- Chạy lần đầu khi tải trang ---
  await loadCart();
});
