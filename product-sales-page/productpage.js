import { apiRequest } from "../common/common.js";

// Danh sách lưu value được chọn
const chosenIdList = [];
const userId = localStorage.getItem("user");
let cart = [];

async function searchProductsByTypeId(typeIds) {
  return await apiRequest({
    url: "goods",
    method: "GET",
    params: { typeIds },
    onError: (err) => {
      console.error("Error fetching products by type:", err);
      alert("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
}

function controlFilter() {
  const checkboxes = document.querySelectorAll(
    '.filter-content input[type="checkbox"]'
  );

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const value = checkbox.value;

      if (checkbox.checked) {
        if (!chosenIdList.includes(value)) {
          chosenIdList.push(value);
        }
      } else {
        const index = chosenIdList.indexOf(value);
        if (index !== -1) {
          chosenIdList.splice(index, 1);
        }
      }
    });
  });
}

function filterProducts() {
  const applyFilterBtn = document.getElementById("apply-filter");
  applyFilterBtn.addEventListener("click", async () => {
    const filteredProducts = await searchProductsByTypeId(chosenIdList);
    renderProducts(filteredProducts);
  });
}

function renderProducts(productList) {
  const productContainer = document.getElementById("product-grid");
  productContainer.innerHTML = ""; // Xóa sản phẩm cũ
  let productHTML = "";
  productList.forEach((product) => {
    productHTML += `
      <div class="product-link-wrapper">
            <div class="product-card" data-category="hoa-len qua-tang">
                <a href="product-detail.html?id=${product.id}">
                    <div class="product-header">
                        <img src="${product.image}" alt="${product.goodName}" />
                        <span class="sale-tag">-30%</span>
                    </div>
                </a>
                <div class="product-actions">
                    <button class="action-btn btn-heart"><i class="far fa-heart"></i></button>
                    <button class="action-btn btn-add-cart" type="button" id="add-to-cart-${
                      product.id
                    }">Add To Cart</button>
                    <button class="action-btn btn-share"><i class="fas fa-share"></i></button>
                </div>
                <div class="product-info">
                    <h3>${product.goodName}</h3>
                    <div class="price">
                        <span class="current-price">${product.price.toLocaleString(
                          "en-US"
                        )} VND</span>
                    </div>
                </div>
            </div>
        </div>
    `;
  });
  productContainer.innerHTML += productHTML;
  productList.forEach((product) => registerAddToCartEvent(product));
}

function registerAddToCartEvent(product) {
  const addToCartBtn = document.getElementById(`add-to-cart-${product.id}`);
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async (e) => {
      await addToCart(product.id);
    });
  }
}

async function addToCart(productId) {
  await apiRequest({
    url: "cart/create",
    method: "POST",
    data: {
      goodsId: productId,
      amount: 1,
    },
    onError: (err) => {
      console.error("Error adding product to cart:", err);
      alert("Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
    },
    requireAuth: true,
  });
}

async function fetchAllCartProducts() {
  return await apiRequest({
    url: "cart/get",
    method: "GET",
    onError: (err) => {
      console.error("Error fetching all cart products:", err);
      alert("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
      return [];
    },
    requireAuth: true,
  });
}

function registerRemoveCartProduct(goods) {
  const removeCartBtn = document.getElementById(`cart-remove-${goods.goodsId}`);
  if (removeCartBtn) {
    removeCartBtn.addEventListener("click", async (e) => {
      await deleteCartProduct(goods.goodsId, goods.cartAmount);
    });
  }
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

  await renderCart();
}

async function renderCart() {
  const listCartHTML = document.querySelector(".list-cart");
  const cartCountSpan = document.querySelector(".cart-count");
  const cartTotalPrice = document.getElementById("cart-total-price");

  // Kiểm tra nếu các phần tử HTML không tồn tại thì dừng lại
  if (!listCartHTML || !cartTotalPrice || !cartCountSpan) {
    console.error("Lỗi: Không tìm thấy các thành phần HTML của giỏ hàng.");
    return;
  }

  cart = (await fetchAllCartProducts(userId)) || [];

  listCartHTML.innerHTML = ""; // Xóa sản phẩm cũ
  let totalQuantity = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    listCartHTML.innerHTML =
      '<p class="cart-empty-msg">Giỏ hàng của bạn đang trống.</p>';
  } else {
    let listItemHTML = "";
    cart.forEach((item) => {
      const itemPriceNum = parseFloat(item.price);
      const itemTotalPrice = itemPriceNum * item.quantity;
      totalQuantity += item.quantity;
      totalPrice += itemTotalPrice;

      listItemHTML += `
                  <div class="cart-item" data-id="${item.id}">
                      <img src="${item.image}" alt="${item.goodName}">
                      <div class="info">
                          <h4>${item.goodName}</h4>
                          <span class="price">${item.price.toLocaleString(
                            "en-US"
                          )}</span>
                      </div>
                      <div class="quantity">
                          <span class="minus">-</span>
                          <span>${item.cartAmount}</span>
                          <span class="plus">+</span>
                      </div>
                      <button class="remove" type="button" id="cart-remove-${
                        item.goodsId
                      }"><i class="fas fa-trash"></i></button>
                  </div>
                  `;
    });
    listCartHTML.innerHTML += listItemHTML;
    for (const cartItem of cart) {
      registerRemoveCartProduct(cartItem);
    }
  }

  const closeCartBtn = document.getElementById("close-cart-btn");
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", toggleCart);
  }
}

function toggleCart() {
  const body = document.querySelector("body");
  body.classList.toggle("showCart");
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

  await renderCart();
}

// Chạy code khi toàn bộ cây HTML đã được tải
document.addEventListener("DOMContentLoaded", async () => {
  const productList = await searchProductsByTypeId([]);
  cart = (await fetchAllCartProducts(userId)) || []; // Get cart from server
  controlFilter();
  filterProducts();
  renderProducts(productList);
  await renderCart();

  const cartIcon = document.getElementById("cart-icon-btn");
  if (cartIcon) {
    cartIcon.addEventListener("click", async (e) => {
      e.preventDefault();
      toggleCart();
      await renderCart();
    });
  }

  const checkoutCartBtn = document.getElementById("checkout-cart-btn");
  if (checkoutCartBtn) {
    checkoutCartBtn.addEventListener("click", async () => {
      await checkoutCart();
    });
  }

  //   // ===========================================
  //   // === 2. LOGIC SIDEBAR BỘ LỌC ===
  //   // ===========================================
  const pageContainer = document.querySelector(".page-container");
  const closeSidebarBtn = document.getElementById("close-sidebar-btn");
  const openSidebarBtn = document.getElementById("open-filter-btn");

  if (closeSidebarBtn && openSidebarBtn && pageContainer) {
    closeSidebarBtn.addEventListener("click", () => {
      pageContainer.classList.add("sidebar-closed");
    });
    openSidebarBtn.addEventListener("click", () => {
      pageContainer.classList.remove("sidebar-closed");
    });
    closeSidebarBtn.style.cursor = "pointer";
    closeSidebarBtn.title = "Bấm để thu gọn bộ lọc";
  }
});
