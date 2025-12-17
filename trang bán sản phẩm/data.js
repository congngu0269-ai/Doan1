// data.js
// Đây là cơ sở dữ liệu (Database) đơn giản của chúng ta

const productsDB = {

    "cat-pot": {
        id: "cat-pot",
        name: "Flower Pot (Cat) - Chậu hoa mèo",
        price: "$12.99",
        oldPrice: "$15.99",
        discount: "-30%",
        mainImage: "https://i.pinimg.com/564x/e7/87/1c/e7871c890696b7a544f8b1a8d052d9b6.jpg",
        thumbnails: [
            "https://i.pinimg.com/564x/e7/87/1c/e7871c890696b7a544f8b1a8d052d9b6.jpg",
            "https://i.pinimg.com/564x/a0/61/8f/a0618f343a411132ce081518f97e88b6.jpg",
            "https://i.pinimg.com/564x/a4/c8/5d/a4c85d68019b3a3625f771a539b5ae78.jpg"
        ],
        description: `
            <p>Một chiếc chậu hoa hình mèo dễ thương để trang trí bàn làm việc.</p>
            <ul>
                <li>Chất liệu: Len cao cấp, an toàn.</li>
                <li>Kích thước: 15cm x 10cm.</li>
                <li>Làm thủ công 100%.</li>
            </ul>
        `
    },

    "tulip-bouquet": {
        id: "tulip-bouquet",
        name: "Bó Hoa Len Tulip",
        price: "$19.99",
        oldPrice: "", // Không có giá cũ
        discount: "", // Không giảm giá
        mainImage: "https://i.pinimg.com/564x/a0/61/8f/a0618f343a411132ce081518f97e88b6.jpg",
        thumbnails: [
            "https://i.pinimg.com/564x/a0/61/8f/a0618f343a411132ce081518f97e88b6.jpg"
        ],
        description: `
            <p>Bó hoa tulip bằng len không bao giờ tàn, một món quà ý nghĩa cho người thân yêu.</p>
            <ul>
                <li>Chất liệu: Len cotton.</li>
                <li>Số lượng: 5 bông.</li>
            </ul>
        `
    },

    "heart-ring": {
        id: "heart-ring",
        name: "Nhẫn Bạc Trái Tim",
        price: "$9.99",
        oldPrice: "$11.99",
        discount: "-15%",
        mainImage: "https://i.pinimg.com/564x/a4/c8/5d/a4c85d68019b3a3625f771a539b5ae78.jpg",
        thumbnails: [
            "https://i.pinimg.com/564x/a4/c8/5d/a4c85d68019b3a3625f771a539b5ae78.jpg"
        ],
        description: `
            <p>Nhẫn bạc 925 hình trái tim nhỏ xinh, phù hợp làm quà tặng.</p>
        `
    },
    
    "thank-you-card": {
        id: "thank-you-card",
        name: "Thiệp Cảm Ơn",
        price: "$2.99",
        oldPrice: "",
        discount: "",
        mainImage: "https://i.pinimg.com/564x/e7/71/61/e771618683e3c004c810c9e6f3630f9c.jpg",
        thumbnails: [
            "https://i.pinimg.com/564x/e7/71/61/e771618683e3c004c810c9e6f3630f9c.jpg"
        ],
        description: `
            <p>Thiệp cảm ơn được làm thủ công, in trên giấy mỹ thuật cao cấp.</p>
        `
    },
    
     "khuyen-tai-hat-cuom": {
        id: "khuyen-tai-hat-cuom",
        name: "Khuyên tai Hạt cườm",
        price: "180.000 ₫",
        oldPrice: "",
        discount: "",
        mainImage: "/images/khuyentai.jpg",
        thumbnails: [
            "https://i.pinimg.com/564x/e7/71/61/e771618683e3c004c810c9e6f3630f9c.jpg"
        ],
        description: `
            <p>Thiệp cảm ơn được làm thủ công, in trên giấy mỹ thuật cao cấp.</p>
        `
    }

};