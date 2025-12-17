// Danh sách lưu value được chọn
const chosenIdList = [];

async function searchProductsByTypeId(typeId) {
  try {
    let url = `http://localhost:3000/goods`;
    if (Array.isArray(typeId) && typeId.length > 0) {
      const typeIdString = typeId.join("&typeIds=");
      url += `?typeIds=${typeIdString}`;
    }
    console.log("URL:", url);
    const response = await fetch(url);
    const products = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch products by type");
    }
    return products;
  } catch (error) {
    alert("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
    console.error("Error fetching products by type:", error);
    return [];
  }
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
    //   const selectedFilters = Array.from(allCheckboxes)
    //     .filter((checkbox) => checkbox.checked)
    //     .map((checkbox) => checkbox.dataset.filter);

    //   allProducts.forEach((product) => {
    //     const productCategories = product.dataset.category.split(" ");
    //     const isMatch =
    //       selectedFilters.length === 0 ||
    //       productCategories.some((cat) => selectedFilters.includes(cat));

    //     const linkWrapper = product.closest(".product-link-wrapper");
    //     if (linkWrapper) {
    //       linkWrapper.style.display = isMatch ? "block" : "none";
    //     }
    //   });
  });
}

function renderProducts(productList) {
  const productContainer = document.getElementById("product-grid");
  productContainer.innerHTML = ""; // Xóa sản phẩm cũ
  productList.forEach((product) => {
    const productHTML = `
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
                    <button class="action-btn btn-add-cart" type="button" onclick="addToCart(${
                      product.id
                    })">Add To Cart</button>
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

    productContainer.innerHTML += productHTML;
  });
}

async function addToCart(productId) {
  const userId = localStorage.getItem("user");
  if (!userId) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
    window.location.href = "/login/login.html";
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/cart/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: userId,
        goodsId: productId,
        amount: 1,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to add product to cart");
    }
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    alert("Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
  }
}

async function fetchAllCartProducts(customerId) {
  console.log("customerId:", customerId);
  try {
    const url = `http://localhost:3000/cart/get?customerId=${customerId}`;
    const response = await fetch(url);
    const cartProducts = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch all cart products");
    }
    console.log("cartProducts:", cartProducts);
    return cartProducts;
  } catch (error) {
    alert("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
    console.error("Error fetching all cart products:", error);
    return [];
  }
}

// Chạy code khi toàn bộ cây HTML đã được tải
document.addEventListener("DOMContentLoaded", async () => {
  const productList = await searchProductsByTypeId([]);
  console.log("productList:", productList);
  controlFilter();
  filterProducts();
  renderProducts(productList);

  //   --- Biến Toàn cục ---
  const userId = localStorage.getItem("user");
  const body = document.querySelector("body");
  const closeCartBtn = document.querySelector(".btn-close-cart");
  const listCartHTML = document.querySelector(".list-cart");
  const cartCountSpan = document.querySelector(".cart-count");
  const cartTotalPrice = document.getElementById("cart-total-price");

  let cart = (await fetchAllCartProducts(userId)) || []; // Tải giỏ hàng từ bộ nhớ
  const cartIcon = document.getElementById("cart-icon-btn");

  function toggleCart() {
    body.classList.toggle("showCart");
    renderCart();
  }

  function renderCart() {
    // Kiểm tra nếu các phần tử HTML không tồn tại thì dừng lại
    if (!listCartHTML || !cartTotalPrice || !cartCountSpan) {
      console.error("Lỗi: Không tìm thấy các thành phần HTML của giỏ hàng.");
      return;
    }
    listCartHTML.innerHTML = ""; // Xóa sản phẩm cũ
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
      listCartHTML.innerHTML =
        '<p class="cart-empty-msg">Giỏ hàng của bạn đang trống.</p>';
    } else {
      cart.forEach((item) => {
        const itemPriceNum = parseFloat(item.price);
        const itemTotalPrice = itemPriceNum * item.quantity;
        totalQuantity += item.quantity;
        totalPrice += itemTotalPrice;

        let newItemHTML = `
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
                      <button class="remove"><i class="fas fa-trash"></i></button>
                  </div>
                  `;
        listCartHTML.innerHTML += newItemHTML;
      });
    }

    if (cartIcon) {
      cartIcon.addEventListener("click", async (e) => {
        e.preventDefault();
        cart = (await fetchAllCartProducts(userId)) || [];
        console.log("Updated cart:", cart);
        toggleCart();
      });
    }

    if (closeCartBtn) {
      closeCartBtn.addEventListener("click", toggleCart);
    }
  }

  renderCart();

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
