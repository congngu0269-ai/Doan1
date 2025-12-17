document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            // Cuon xuong hon 50px se them class scrolled
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                // Neu o tren cung se chuyen ve trang thai trong suot
                header.classList.remove('scrolled');
            }
        });
    }
});