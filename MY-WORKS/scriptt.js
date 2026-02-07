document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.2, // Lowered threshold
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imageWrapper = entry.target.querySelector('.image-wrapper');
                const text = entry.target.querySelector('.section-content');

                // Check if elements exist and haven't been animated yet
                if (imageWrapper && !imageWrapper.classList.contains('animate')) {
                    imageWrapper.classList.add('animate');

                    if (text) {
                        setTimeout(() => {
                            text.classList.add('animate');
                        }, 500);
                    }
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});