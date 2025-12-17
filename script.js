document.addEventListener('DOMContentLoaded', () => {
    // Xử lý hiệu ứng cuộn Header
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            // Nếu cuộn xuống hơn 50px, thêm class 'scrolled'
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                // Nếu ở trên cùng, bỏ class 'scrolled' (về trong suốt)
                header.classList.remove('scrolled');
            }
        });
    }
});