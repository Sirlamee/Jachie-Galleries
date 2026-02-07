// Back to Top Functionality
const backToTopButton = document.getElementById('backToTop');

// Show button when not on first section
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Show button when scrolled past first section (100vh)
    if (scrollPosition > window.innerHeight * 0.5) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

// Scroll to first section when clicked (compatible with section scroll)
backToTopButton.addEventListener('click', () => {
    const firstSection = document.querySelector('.section[data-section="1"]');
    
    if (firstSection) {
        firstSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Also reset the currentSection in scroll.js
        // This ensures scroll tracking is correct
        const event = new CustomEvent('scrollToTop');
        window.dispatchEvent(event);
    }
});