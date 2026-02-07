// Animated text reveal
const animatedTexts = document.querySelectorAll('.animated-text');

// Intersection Observer for text animation
const textObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const spans = entry.target.querySelectorAll('span');
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.classList.add('revealed');
                }, index * 20); // 30ms delay per letter
            });
            textObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

// Process each animated text element
animatedTexts.forEach(animatedText => {
    const text = animatedText.textContent;
    animatedText.innerHTML = '';

    // Split text into spans
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');

        span.textContent = text[i];
        animatedText.appendChild(span);
    }

    textObserver.observe(animatedText);
});
