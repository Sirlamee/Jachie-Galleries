// Sticky navbar based on section
const heroNavbar = document.querySelector('.hero-navbar');
const stickyNavbar = document.querySelector('.sticky-navbar');

// Function to update navbar visibility
window.updateNavbarVisibility = function (currentSection) {
    if (currentSection > 0) {
        heroNavbar.classList.add('hidden');
        stickyNavbar.classList.add('visible');
    } else {
        heroNavbar.classList.remove('hidden');
        stickyNavbar.classList.remove('visible');
    }
};

