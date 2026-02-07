// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Hamburger menu functionality
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const navLinks = document.querySelector('.sticky-nav-links');
    const stickyNavbar = document.querySelector('.sticky-navbar');

    if (hamburgerIcon && navLinks && stickyNavbar) {
        hamburgerIcon.addEventListener('click', function () {
            hamburgerIcon.classList.toggle('active');
            navLinks.classList.toggle('active');
            stickyNavbar.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!hamburgerIcon.contains(event.target) && !navLinks.contains(event.target)) {
                hamburgerIcon.classList.remove('active');
                navLinks.classList.remove('active');
                stickyNavbar.classList.remove('menu-open');
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                hamburgerIcon.classList.remove('active');
                navLinks.classList.remove('active');
                stickyNavbar.classList.remove('menu-open');
            });
        });
    }
});