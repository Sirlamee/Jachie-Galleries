// Third Section Scroll Animation
let thirdSectionScrollProgress = 0;
let currentSubsection = 0;
const totalSubsections = 3;
let hasTriggeredImageAnimation = false;

const thirdSection = document.querySelector('.third-section');
const subsections = document.querySelectorAll('.subsection');
const mainHeading = document.querySelector('.main-heading');
const imageContainer = document.querySelector('.animated-image-container');

// Function to update subsection visibility
function updateSubsection(index) {
    subsections.forEach((subsection, i) => {
        if (i === index) {
            // Remove fading-out class and add active
            subsection.classList.remove('fading-out');
            subsection.classList.add('active');
        } else {
            // Add fading-out class before removing active
            if (subsection.classList.contains('active')) {
                subsection.classList.add('fading-out');
            }
            subsection.classList.remove('active');
        }
    });
}

// Function to trigger image animation when entering third section
function triggerImageAnimation() {
    if (!hasTriggeredImageAnimation && imageContainer) {
        imageContainer.classList.add('animate');
        hasTriggeredImageAnimation = true;
    }
}

// Handle scroll within third section
function handleThirdSectionScroll(deltaY) {
    const scrollDirection = deltaY > 0 ? 1 : -1;

    // If scrolling down and not at last subsection
    if (scrollDirection > 0 && currentSubsection < totalSubsections - 1) {
        currentSubsection++;
        updateSubsection(currentSubsection);
        return true; // Prevent default scroll
    }
    // If scrolling up and not at first subsection
    else if (scrollDirection < 0 && currentSubsection > 0) {
        currentSubsection--;
        updateSubsection(currentSubsection);
        return true; // Prevent default scroll
    }

    return false; // Allow default scroll to next/previous section
}

// Export for use in scroll.js
window.thirdSectionHandler = {
    handleScroll: handleThirdSectionScroll,
    triggerAnimation: triggerImageAnimation,
    reset: () => {
        currentSubsection = 0;
        updateSubsection(0);
        hasTriggeredImageAnimation = false;
        if (imageContainer) {
            imageContainer.classList.remove('animate');
        }
    },
    isAtStart: () => currentSubsection === 0,
    isAtEnd: () => currentSubsection === totalSubsections - 1
};

// Initialize first subsection as active
updateSubsection(0);
