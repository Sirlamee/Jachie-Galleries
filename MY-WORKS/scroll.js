document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    let isScrolling = false;
    let currentSection = 0;

    // Disable default scroll behavior
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        e.preventDefault();
        isScrolling = true;

        // Determine direction
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            // Scroll down
            currentSection++;
        } else if (e.deltaY < 0 && currentSection > 0) {
            // Scroll up
            currentSection--;
        }

        // Scroll to target section
        sections[currentSection].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Reset scroll lock after animation
        setTimeout(() => {
            isScrolling = false;
        }, 1000);

    }, { passive: false });

    // Touch support for mobile swipe
    let touchStartY = 0;
    
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        // Minimum swipe distance
        if (Math.abs(diff) > 50) {
            isScrolling = true;
            
            if (diff > 0 && currentSection < sections.length - 1) {
                // Swipe up
                currentSection++;
            } else if (diff < 0 && currentSection > 0) {
                // Swipe down
                currentSection--;
            }

            sections[currentSection].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isScrolling) return;

        if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
            isScrolling = true;
            currentSection++;
            sections[currentSection].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setTimeout(() => { isScrolling = false; }, 1000);
        } else if (e.key === 'ArrowUp' && currentSection > 0) {
            isScrolling = true;
            currentSection--;
            sections[currentSection].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setTimeout(() => { isScrolling = false; }, 700);
        }
    });

    // Track current section with Intersection Observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSection = Array.from(sections).indexOf(entry.target);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));

    // Listen for back to top button
    window.addEventListener('scrollToTop', () => {
        currentSection = 0;
        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    });
});