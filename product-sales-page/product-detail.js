import { apiRequest } from "../common/common.js";

async function fetchProductData(productId) {
  return await apiRequest({
    url: "goods-details",
    params: { goodsId: productId },
    method: "GET",
    onSuccess: (data) => {
      console.log("Product data fetched:", data);
      return data;
    },
    onError: (err) => {
      console.error("Error fetching product data:", err);
      alert("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
    },
    requireAuth: true,
  });
}

async function addToCart(productId, amount) {
  await apiRequest({
    url: "cart/create",
    method: "POST",
    data: { productId, amount },
    onSuccess: (data) => {
      console.log("Product added to cart:", data);
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    },
    onError: (err) => {
      console.error("Error adding product to cart:", err);
      alert("Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
    },
    requireAuth: true,
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // === 1. LẤY ID SẢN PHẨM TỪ URL ===
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // === 2. TÌM DỮ LIỆU SẢN PHẨM ===
  let productData = null;
  if (productId) {
    console.log("Product ID:", productId);
    productData = await fetchProductData(productId);
  }

  // === 4. LOGIC CỘNG/TRỪ SỐ LƯỢNG ===
  const qtyInput = document.getElementById("qty-input");
  const qtyPlus = document.getElementById("qty-plus");
  const qtyMinus = document.getElementById("qty-minus");

  if (qtyInput && qtyPlus && qtyMinus) {
    qtyPlus.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    qtyMinus.addEventListener("click", () => {
      let val = parseInt(qtyInput.value);
      if (val > 1) {
        qtyInput.value = val - 1;
      }
    });
    qtyInput.addEventListener("change", () => {
      if (parseInt(qtyInput.value) < 1 || !qtyInput.value) {
        qtyInput.value = 1;
      }
    });
  }

  // === 5. LOGIC THÊM VÀO GIỎ HÀNG ===
  const addToCartButton = document.getElementById("add-to-cart-button");

  if (addToCartButton) {
    addToCartButton.addEventListener("click", async () => {
      await addToCart(productId, parseInt(qtyInput.value));
    });
  }

  console.log("H1", productData);
  // === 3. BƠM (INJECT) DỮ LIỆU VÀO TRANG ===
  if (productData) {
  console.log("H1.2")

    // Cập nhật tiêu đề trang
    document.title = `${productData.goodName} - HM Shop`;
  console.log("H2")

    // Cập nhật thông tin chính
    document.getElementById("product-name").textContent = productData.goodName;
  console.log("H3")

    document.getElementById("product-price").textContent =
      productData.price.toLocaleString("en-US") + " VND";
      document.getElementById("product-old-price").style.display = "none";
      document.getElementById("product-discount").style.display = "none";

    // Cập nhật ảnh chính
    document.getElementById("main-product-image").src = productData.image;

  } else {
    // Nếu không tìm thấy ID sản phẩm, báo lỗi và DỪNG LẠI
    document.querySelector(
      ".product-detail-container"
    ).innerHTML = `<h1>Lỗi: Không tìm thấy sản phẩm.</h1> <p>Vui lòng quay lại trang sản phẩm và thử lại.</p>`;

    // Dừng hàm tại đây để không chạy code bên dưới
    return;
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

  // =======================================================
  // CODE BÊN DƯỚI SẼ CHỈ CHẠY NẾU productData TỒN TẠI
  // =======================================================

  // --- XỬ LÝ THƯ VIỆN ẢNH ---
  const mainImage = document.getElementById("main-product-image");
  const thumbnails = document.querySelectorAll(".thumbnail-img");

  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", function () {
        mainImage.src = this.src;
        thumbnails.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  const cartIcon = document.getElementById("cart-icon-btn");
  cartIcon.addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.href = "../cart/cart.html";
  });
})
