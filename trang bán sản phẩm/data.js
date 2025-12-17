// data.js - Cơ sở dữ liệu sản phẩm (Giá tiền Việt Nam)

const productsDB = {

    "tulip-bouquet": {
        id: "tulip-bouquet",
        name: "Bó Hoa Len Tulip (5 Bông)",
        price: "499.000 ₫",
        oldPrice: "", 
        discount: "", 
        mainImage: "https://i.pinimg.com/564x/a0/61/8f/a0618f343a411132ce081518f97e88b6.jpg",
        thumbnails: [
            "https://i.pinimg.com/564x/a0/61/8f/a0618f343a411132ce081518f97e88b6.jpg",
            "https://i.pinimg.com/564x/e7/87/1c/e7871c890696b7a544f8b1a8d052d9b6.jpg"
        ],
        description: `
            <p>Bó hoa tulip bằng len không bao giờ tàn, tượng trưng cho tình yêu vĩnh cửu. Màu sắc tươi tắn, được gói ghém cẩn thận trong giấy kraft phong cách vintage.</p>
            <ul>
                <li>Chất liệu: Len cotton.</li>
                <li>Số lượng: 5 bông tulip.</li>
                <li>Màu sắc: Hồng, Vàng, Tím (Giao ngẫu nhiên hoặc ghi chú).</li>
            </ul>
        `
    },

    "heart-ring": {
        id: "heart-ring",
        name: "Nhẫn Bạc Trái Tim",
        price: "250.000 ₫",
        oldPrice: "300.000 ₫",
        discount: "-15%",
        mainImage: "https://i.pinimg.com/564x/a4/c8/5d/a4c85d68019b3a3625f771a539b5ae78.jpg",
        thumbnails: [
            "https://i.pinimg.com/564x/a4/c8/5d/a4c85d68019b3a3625f771a539b5ae78.jpg"
        ],
        description: `
            <p>Nhẫn bạc 925 hình trái tim nhỏ xinh, thiết kế tinh tế, phù hợp làm quà tặng cho người thương hoặc bạn bè thân thiết.</p>
            <ul>
                <li>Chất liệu: Bạc 925 cao cấp.</li>
                <li>Kích thước: Freesize (có thể điều chỉnh).</li>
            </ul>
        `
    },
    
    "thank-you-card": {
        id: "thank-you-card",
        name: "Thiệp Cảm Ơn Handmade",
        price: "15.000 ₫",
        oldPrice: "",
        discount: "",
        mainImage: "https://i.pinimg.com/564x/e7/71/61/e771618683e3c004c810c9e6f3630f9c.jpg",
        thumbnails: [
            "https://i.pinimg.com/564x/e7/71/61/e771618683e3c004c810c9e6f3630f9c.jpg"
        ],
        description: `
            <p>Thiệp cảm ơn được làm thủ công, in trên giấy mỹ thuật cao cấp. Thiết kế đơn giản nhưng sang trọng, giúp bạn gửi gắm những lời chúc chân thành nhất.</p>
            <ul>
                <li>Kích thước: 10cm x 15cm.</li>
                <li>Kèm phong bì vintage.</li>
            </ul>
        `
    },

    "hoa-giay-nhun": {
        id: "hoa-giay-nhun",
        name: "Hoa giấy nhún",
        price: "84.000 đ",
        oldPrice: "120.000 đ",
        discount: "-30%",
        mainImage: "/images/hoagiay.png",
        thumbnails: [
            "/images/hoagiay2.jpg",
            "/images/hoagiay.png",
            "/images/hoagiay3.jpg",
            "/images/hoagiay4.jpg"
        ],
        description: `
            <p>Một chiếc bình hoa giấy nhún.</p>
            <ul>
                <li>Chất liệu: Giấy nhún.</li>
                <li>Giữ form tốt.</li>
                <li>Vân giấy (Nếp nhăn): Bề mặt sần nhẹ của giấy nhún tạo cảm giác giống như gân của cánh hoa tự nhiên.</li>
                <li>Làm thủ công 100%.</li>
            </ul>
        `
    },

    
    "nhan-bac-sterling": {
        id: "nhan-bac-sterling",
        name: "Nhẫn bạc Sterling",
        price: "540.000 đ",
        oldPrice: "600.000 đ",
        discount: "-10%",
        mainImage: "/images/nhan1.jpg",
        thumbnails: [
            "/images/nhan1.jpg",
            "/images/nhan2.jpg",
            "/images/nhan3.jpg",
            "/images/nhan4.jpg"
        ],
        description: `
            <p>Chiếc nhẫn bạc Sterling được làm thủ công đặt trong đó là tâm huyết của người thợ.</p>
            <ul>
                <li>Chất liệu: Bạc Sterling.</li>
            </ul>
        `
    },


    "khuyen-tai-hat-cuom": {
        id: "khuyen-tai-hat-cuom",
        name: "Khuyên tai Hạt cườm",
        price: "180.000 đ",
        mainImage: "/images/khuyentai.jpg",
        thumbnails: [
            "/images/khuyentai.jpg"
        ],
        description: `
            <p>Khuyên tai Hạt cườm sang trọng, quý phái.</p>
        `
    }
};