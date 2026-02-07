let isScrolling = false;
let currentSection = 0;
const sections = document.querySelectorAll('section');
const sectionContainer = document.querySelector('.section-container');

// Art Gallery specific variables
let galleryScrollProgress = 0;
const maxGalleryScrolls = 5;
const gallerySection = document.getElementById('gallery-section');
const imageItems = document.querySelectorAll('.image-item');

// Sixth Section specific variables for mobile
let sixthSectionScrollProgress = 0;
const maxSixthSectionScrolls = 1; // Allow one extra scroll on mobile
const sixthSection = document.querySelector('.sixth-section');

// Check if mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Disable default scrolling completely
document.body.style.overflow = 'hidden';
document.documentElement.style.overflow = 'hidden';

// Function to update section position
function updateSectionPosition() {
  const offset = currentSection * -100;
  sectionContainer.style.transform = `translateY(${offset}vh)`;
}

// Update gallery images based on scroll progress
function updateGalleryImages() {
  if (!imageItems.length) return; // Exit if no gallery section

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

window.addEventListener('wheel', (e) => {
  e.preventDefault();

  if (isScrolling) return;

  const scrollDirection = e.deltaY > 0 ? 'down' : 'up';

  // Check if we're in the third section (subsections handler)
  const isInThirdSection = currentSection === 2;

  // Check if we're in the art gallery section (adjust index based on your sections)
  // Assuming gallery is section 5 (index 4)
  const isInGallerySection = currentSection === 4 && gallerySection;

  // Handle third section specially (your existing code)
  if (isInThirdSection && window.thirdSectionHandler) {
    const handler = window.thirdSectionHandler;

    // If scrolling down and not at the end of subsections
    if (scrollDirection === 'down' && !handler.isAtEnd()) {
      isScrolling = true;
      handler.handleScroll(e.deltaY);
      setTimeout(() => {
        isScrolling = false;
      }, 800);
      return;
    }
    // If scrolling up and not at the start of subsections
    else if (scrollDirection === 'up' && !handler.isAtStart()) {
      isScrolling = true;
      handler.handleScroll(e.deltaY);
      setTimeout(() => {
        isScrolling = false;
      }, 800);
      return;
    }
  }

  // Handle art gallery section specially
  if (isInGallerySection) {
    isScrolling = true;

    if (scrollDirection === 'down') {
      // If we haven't finished revealing images, continue revealing
      if (galleryScrollProgress < maxGalleryScrolls) {
        galleryScrollProgress++;
        updateGalleryImages();
        setTimeout(() => {
          isScrolling = false;
        }, 600);
        return;
      }
      // If images are fully revealed, move to next section
      else if (galleryScrollProgress === maxGalleryScrolls && currentSection < sections.length - 1) {
        currentSection++;
        updateSectionPosition();
        galleryScrollProgress = 0; // Reset for next time
        setTimeout(() => {
          isScrolling = false;
        }, 800);
        return;
      }
    } else if (scrollDirection === 'up') {
      // If we're in the middle of revealing, go back
      if (galleryScrollProgress > 0) {
        galleryScrollProgress--;
        updateGalleryImages();
        setTimeout(() => {
          isScrolling = false;
        }, 600);
        return;
      }
      // If at the start of gallery, go to previous section
      else if (galleryScrollProgress === 0 && currentSection > 0) {
        currentSection--;
        updateSectionPosition();
        setTimeout(() => {
          isScrolling = false;
        }, 800);
        return;
      }
    }
  }

  // Handle sixth section specially on mobile (multiple scrolls to show all content)
  const isInSixthSection = currentSection === 5 && sixthSection && isMobile();

  if (isInSixthSection) {
    isScrolling = true;

    if (scrollDirection === 'down') {
      // If we haven't finished scrolling through the section, continue scrolling
      if (sixthSectionScrollProgress < maxSixthSectionScrolls) {
        sixthSectionScrollProgress++;
        // Scroll the sixth section content
        const scrollAmount = sixthSectionScrollProgress * 100;
        sixthSection.style.transform = `translateY(-${scrollAmount}vh)`;
        setTimeout(() => {
          isScrolling = false;
        }, 600);
        return;
      }
      // If we've scrolled through the section, we're at the end (no next section)
      else if (sixthSectionScrollProgress === maxSixthSectionScrolls) {
        setTimeout(() => {
          isScrolling = false;
        }, 600);
        return;
      }
    } else if (scrollDirection === 'up') {
      // If we're in the middle of the section, scroll back up
      if (sixthSectionScrollProgress > 0) {
        sixthSectionScrollProgress--;
        const scrollAmount = sixthSectionScrollProgress * 100;
        sixthSection.style.transform = `translateY(-${scrollAmount}vh)`;
        setTimeout(() => {
          isScrolling = false;
        }, 600);
        return;
      }
      // If at the start of sixth section, go to previous section
      else if (sixthSectionScrollProgress === 0 && currentSection > 0) {
        currentSection--;
        updateSectionPosition();
        setTimeout(() => {
          isScrolling = false;
        }, 800);
        return;
      }
    }
  }

  // Normal section scrolling
  isScrolling = true;

  // Determine scroll direction
  if (e.deltaY > 0 && currentSection < sections.length - 1) {
    currentSection++;

    // Trigger image animation when entering third section
    if (currentSection === 2 && window.thirdSectionHandler) {
      window.thirdSectionHandler.triggerAnimation();
    }
    // Reset third section when leaving it
    if (currentSection === 3 && window.thirdSectionHandler) {
      window.thirdSectionHandler.reset();
    }
    // Reset gallery when entering it
    if (currentSection === 4 && gallerySection) {
      galleryScrollProgress = 0;
      updateGalleryImages();
    }
    // Reset sixth section when entering it on mobile
    if (currentSection === 5 && sixthSection && isMobile()) {
      sixthSectionScrollProgress = 0;
      sixthSection.style.transform = 'translateY(0)';
    }
  } else if (e.deltaY < 0 && currentSection > 0) {
    currentSection--;

    // Trigger image animation when entering third section from below
    if (currentSection === 2 && window.thirdSectionHandler) {
      window.thirdSectionHandler.triggerAnimation();
    }
    // Reset gallery when entering it from below
    if (currentSection === 4 && gallerySection) {
      galleryScrollProgress = 0;
      updateGalleryImages();
    }
    // Reset sixth section when entering it from below on mobile
    if (currentSection === 5 && sixthSection && isMobile()) {
      sixthSectionScrollProgress = 0;
      sixthSection.style.transform = 'translateY(0)';
    }
  }

  // Update section position
  updateSectionPosition();

  // Update navbar visibility
  if (window.updateNavbarVisibility) {
    window.updateNavbarVisibility(currentSection);
  }

  // Reset after scroll completes
  setTimeout(() => {
    isScrolling = false;
  }, 800);
});

// Initialize
updateSectionPosition();
updateGalleryImages();

// Initialize navbar visibility
setTimeout(() => {
  if (window.updateNavbarVisibility) {
    window.updateNavbarVisibility(currentSection);
  }
}, 100);
