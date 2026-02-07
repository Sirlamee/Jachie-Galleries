    let currentSection = 0;
    let galleryScrollProgress = 0;
    const maxGalleryScrolls = 5;
    let isScrolling = false;
    const sections = document.querySelectorAll('section');
    const gallerySection = document.getElementById('gallery-section');
    const imageItems = document.querySelectorAll('.image-item');

    // Disable default smooth scrolling
    document.documentElement.style.scrollBehavior = 'auto';

    // Update gallery images based on scroll progress
    function updateGalleryImages() {
      imageItems.forEach(item => {
        // Remove all reveal classes
        item.classList.remove('hidden', 'reveal-1', 'reveal-2', 'reveal-3', 'reveal-4', 'reveal-5');
        
        // Add appropriate reveal class based on progress
        if (galleryScrollProgress === 0) {
          item.classList.add('hidden');
        } else if (galleryScrollProgress >= 1 && galleryScrollProgress <= 5) {
          item.classList.add(`reveal-${galleryScrollProgress}`);
        }
      });
    }

    // Scroll to specific section
    function scrollToSection(index) {
      const targetSection = sections[index];
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Handle wheel event
    window.addEventListener('wheel', (e) => {
      e.preventDefault();

      if (isScrolling) return;

      const scrollDirection = e.deltaY > 0 ? 'down' : 'up';
      
      // Check if we're in the gallery section (section 5, index 4)
      if (currentSection === 4) {
        isScrolling = true;

        if (scrollDirection === 'down') {
          // If we haven't finished revealing images, continue revealing
          if (galleryScrollProgress < maxGalleryScrolls) {
            galleryScrollProgress++;
            updateGalleryImages();
          } 
          // If images are fully revealed, move to next section
          else if (galleryScrollProgress === maxGalleryScrolls) {
            currentSection = 5;
            scrollToSection(currentSection);
          }
        } else if (scrollDirection === 'up') {
          // If we're in the middle of revealing, go back
          if (galleryScrollProgress > 0) {
            galleryScrollProgress--;
            updateGalleryImages();
          }
          // If at the start of gallery, go to previous section
          else {
            currentSection = 3;
            scrollToSection(currentSection);
            galleryScrollProgress = 0;
            updateGalleryImages();
          }
        }

        setTimeout(() => {
          isScrolling = false;
        }, 600);
      } 
      // Normal section scrolling
      else {
        isScrolling = true;

        if (scrollDirection === 'down' && currentSection < sections.length - 1) {
          currentSection++;
          scrollToSection(currentSection);
          
          // Reset gallery if entering it
          if (currentSection === 4) {
            galleryScrollProgress = 0;
            updateGalleryImages();
          }
        } else if (scrollDirection === 'up' && currentSection > 0) {
          currentSection--;
          scrollToSection(currentSection);
          
          // Reset gallery if leaving it
          if (currentSection === 4) {
            galleryScrollProgress = 0;
            updateGalleryImages();
          }
        }

        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    }, { passive: false });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        
        const fakeEvent = {
          deltaY: e.key === 'ArrowDown' ? 100 : -100,
          preventDefault: () => {}
        };
        
        window.dispatchEvent(new WheelEvent('wheel', fakeEvent));
      }
    });

    // Initialize
    updateGalleryImages();
    scrollToSection(0);
