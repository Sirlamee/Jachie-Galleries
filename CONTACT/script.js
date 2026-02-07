// Simple Scroll Animation Controller using Intersection Observer
class PageController {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    init() {
        // Trigger initial animations for section 1 (hero image)
        this.triggerSectionAnimations(0);

        // Set up Intersection Observer for scroll-triggered animations
        this.enableScrollAnimations();
    }

    enableScrollAnimations() {
        // Use Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.2, // Trigger when 20% of section is visible
            rootMargin: '-50px 0px' // Slight offset from viewport edges
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(this.sections).indexOf(entry.target);
                    this.triggerSectionAnimations(sectionIndex);
                }
            });
        }, observerOptions);

        // Observe all sections
        this.sections.forEach(section => observer.observe(section));
    }

    triggerSectionAnimations(sectionIndex) {
        const section = this.sections[sectionIndex];

        // Section 1 animations (hero image - already has CSS animation on load)
        if (sectionIndex === 0) {
            // Image animation is handled by CSS
        }

        // Section 2 animations
        if (sectionIndex === 1) {
            // Animated text will be handled by animatedText.js

            // Trigger rotating images
            setTimeout(() => {
                const rotatingImages = section.querySelectorAll('.rotating-images .image-container');
                rotatingImages.forEach(img => {
                    if (!img.classList.contains('animate')) {
                        img.classList.add('animate');
                    }
                });
            }, 300);

            // Trigger text grid fade-in
            setTimeout(() => {
                const textGridItems = section.querySelectorAll('.text-grid-item');
                textGridItems.forEach(item => {
                    if (!item.classList.contains('fade-in')) {
                        item.classList.add('fade-in');
                    }
                });
            }, 600);
        }

        // Section 3 animations
        if (sectionIndex === 2) {
            setTimeout(() => {
                const h2 = section.querySelector('.text-image-grid-item h2');
                const contactInfos = section.querySelector('.contact-infos');
                const img = section.querySelector('.image-grid img');

                if (h2 && !h2.classList.contains('slide-up')) {
                    h2.classList.add('slide-up');
                }
                if (contactInfos && !contactInfos.classList.contains('slide-up')) {
                    contactInfos.classList.add('slide-up');
                }
                if (img && !img.classList.contains('reveal-down')) {
                    img.classList.add('reveal-down');
                }
            }, 200);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PageController();
});
