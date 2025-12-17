async function fetchProductData(productId) {
  try {
    let url = `http://localhost:3000/goods-details?goodsId=${productId}`;
    const response = await fetch(url);
    const product = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return product;
  } catch (error) {
    alert("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
    console.error("Error fetching product:", error);
    return null;
  }
}

async function addToCart(productId, amount) {
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
        amount: amount,
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

document.addEventListener("DOMContentLoaded", async () => {
  // === 1. LẤY ID SẢN PHẨM TỪ URL ===
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // === 2. TÌM DỮ LIỆU SẢN PHẨM ===
  let productData = null;
  if (productId) {
    productData = await fetchProductData(productId);
  }
  console.log("helloN2");

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
  console.log("helloN1");

  // === 5. LOGIC THÊM VÀO GIỎ HÀNG ===
  const addToCartButton = document.getElementById("add-to-cart-button");

  if (addToCartButton) {
    addToCartButton.addEventListener("click", async () => {
      await addToCart(productId, parseInt(qtyInput.value));
    });
  }
  console.log("helloN");

  // === 3. BƠM (INJECT) DỮ LIỆU VÀO TRANG ===
  if (productData) {
    // Cập nhật tiêu đề trang
    document.title = `${productData.goodName} - HM Shop`;
  console.log("helloM");

    // Cập nhật thông tin chính
    document.getElementById("product-name").textContent = productData.goodName;
    document.getElementById("product-price").textContent =
      productData.price.toLocaleString("en-US") + " VND";

    if (productData.oldPrice) {
      document.getElementById("product-old-price").textContent =
        productData.oldPrice;
    } else {
      document.getElementById("product-old-price").style.display = "none";
    }
  console.log("helloM1");

    if (productData.discount) {
      document.getElementById("product-discount").textContent =
        productData.discount;
    } else {
      document.getElementById("product-discount").style.display = "none";
    }
  console.log("helloM2");

    // Cập nhật ảnh chính
    document.getElementById("main-product-image").src = productData.image;
  console.log("helloM21");

    // Cập nhật ảnh thumbnail
    const thumbnailContainer = document.getElementById("product-thumbnails");
    thumbnailContainer.innerHTML = ""; // Xóa ảnh mẫu
  console.log("helloM22");

//     productData.thumbnails.forEach((thumbSrc, index) => {
//       const img = document.createElement("img");
//       img.src = thumbSrc;
//       img.alt = `Thumbnail ${index + 1}`;
//       img.classList.add("thumbnail-img");
//       if (index === 0) {
//         img.classList.add("active"); // Kích hoạt ảnh đầu tiên
//       }
//       thumbnailContainer.appendChild(img);
//   console.log("helloM23");

//     });
  console.log("helloM3");

    // Cập nhật mô tả
    const descSection = document.getElementById("product-description");
    // Xóa nội dung "Đang tải" cũ (nếu có) và thêm mô tả mới
    descSection.innerHTML = `<h2>Mô Tả Sản Phẩm</h2>` + productData.description;
  console.log("helloM4");

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
});
