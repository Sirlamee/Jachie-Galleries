// Artwork data for dynamic content switching
const artworkData = {
    silence: {
        title: "Silence",
        description: 'This piece "SILENCE " is inspired by the emotional patterns of everyday life. Psychologists say humans experience over 27 distinct emotions, but most of them are rarely expressed openly. In Nigeria especially, people are taught to "be strong," so much of what we feel is hidden behind silence, laughter, or routine. I chose to use discarded fabrics because fabric in Africa is not just cloth it carries memory, culture, and identity. By using thrown-away fabric, I show how even what is forgotten can become beautiful again. To enquire or purchase, please contact me via email',
        images: ['../Assets/girlSleep.jpg', '../Assets/colourGirll.png'],
        estimatedValue: "Sold",
        medium: "Fabric",
        dimensions: "134.62cm x 152.4cm"
    },
    alhaja: {
        title: "Alhaja",
        description: "This artwork explores themes of tradition and modernity, showcasing the rich cultural heritage through repurposed fabrics. Each piece tells a story of resilience and beauty, transforming discarded materials into meaningful art.",
        images: ['../Assets/alhaja.jpg'],
        estimatedValue: "$2,500",
        medium: "Fabric",
        dimensions: "120cm x 140cm"
    },
    boyPraying: {
        title: "Prayer",
        description: "A contemplative piece that captures the essence of spirituality and devotion. Using traditional fabrics, this work reflects the deep connection between faith, culture, and artistic expression in everyday life.",
        images: ['../Assets/boyPraying.png'],
        estimatedValue: "$1,800",
        medium: "Fabric",
        dimensions: "110cm x 130cm"
    },
    colourGirl: {
        title: "Vibrant Spirit",
        description: "This colorful creation celebrates the vibrancy and energy of youth. Through bold fabric choices and dynamic composition, it represents the joy and resilience found in African communities.",
        images: ['../Assets/colourGirll.png'],
        estimatedValue: "$2,200",
        medium: "Fabric",
        dimensions: "125cm x 145cm"
    },
    boyLaugh: {
        title: "Joy Unbound",
        description: "Capturing pure happiness and freedom, this piece uses discarded fabrics to show how beauty emerges from unexpected places. It's a reminder that joy can be found even in the simplest moments.",
        images: ['../Assets/boyLaugh.jpg'],
        estimatedValue: "$1,950",
        medium: "Fabric",
        dimensions: "115cm x 135cm"
    }
};

// Global scroll control variables
let isScrolling = false;
let currentSection = 0;
let carouselScrollProgress = 0;
let maxCarouselScrolls = 2; // Will be set dynamically based on number of images

// Check if desktop view
function isDesktop() {
    return window.innerWidth > 768;
}

// Scroll-hijacking Carousel
class ScrollCarousel {
    constructor() {
        this.sectionContainer = document.querySelector('.section-container');
        this.sections = document.querySelectorAll('.section, .section-two');
        this.sectionOne = document.querySelector('.section-one');
        this.images = document.querySelectorAll('.carousel-image');
        this.progressBar = document.querySelector('.progress-bar');
        this.currentImageIndex = 0;
        this.totalImages = this.images.length;
        this.autoPlayInterval = null; // For mobile auto-play
        this.boundHandleScroll = this.handleScroll.bind(this); // Store bound function
        
        // Update global max carousel scrolls
        maxCarouselScrolls = this.totalImages;
        
        this.init();
    }

    init() {
        // Set first image as active (works on both mobile and desktop)
        this.images[0].classList.add('active');
        this.progressBar.classList.add('top');
        
        // Setup based on initial screen size
        this.setupForScreenSize();
        
        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.setupForScreenSize();
            }, 250);
        });
    }

    setupForScreenSize() {
        if (isDesktop()) {
            // DESKTOP: Scroll hijacking for carousel + sections
            this.stopAutoPlay();
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            window.removeEventListener('wheel', this.boundHandleScroll); // Remove first to avoid duplicates
            window.addEventListener('wheel', this.boundHandleScroll, { passive: false });
        } else {
            // MOBILE: Auto-play carousel with timer, normal scrolling
            window.removeEventListener('wheel', this.boundHandleScroll);
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        // Auto-play for mobile - cycle through images every 5 seconds
        this.autoPlayInterval = setInterval(() => {
            const nextIndex = (this.currentImageIndex + 1) % this.totalImages;
            this.goToImage(nextIndex);
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    handleScroll(e) {
        // This only runs on DESKTOP (scroll hijacking)
        e.preventDefault();
        
        if (isScrolling) return;
        
        const scrollDirection = e.deltaY > 0 ? 'down' : 'up';
        const isInCarouselSection = currentSection === 0;
        
        if (isInCarouselSection) {
            isScrolling = true;
            
            if (scrollDirection === 'down') {
                // If we haven't finished the carousel, continue cycling images
                if (carouselScrollProgress < maxCarouselScrolls - 1) {
                    carouselScrollProgress++;
                    this.goToImage(carouselScrollProgress);
                    setTimeout(() => {
                        isScrolling = false;
                    }, 800);
                    return;
                }
                // If carousel is complete, move to next section
                else if (carouselScrollProgress === maxCarouselScrolls - 1 && currentSection < this.sections.length - 1) {
                    currentSection++;
                    this.updateSectionPosition();
                    carouselScrollProgress = 0; // Reset for next time
                    setTimeout(() => {
                        isScrolling = false;
                    }, 800);
                    return;
                }
            } else if (scrollDirection === 'up') {
                // If we're in the middle of carousel, go back
                if (carouselScrollProgress > 0) {
                    carouselScrollProgress--;
                    this.goToImage(carouselScrollProgress);
                    setTimeout(() => {
                        isScrolling = false;
                    }, 800);
                    return;
                }
            }
            
            isScrolling = false;
            return;
        }
        
        // Normal section scrolling for other sections
        isScrolling = true;
        
        if (scrollDirection === 'down' && currentSection < this.sections.length - 1) {
            currentSection++;
        } else if (scrollDirection === 'up' && currentSection > 0) {
            currentSection--;
            
            // Reset carousel when entering section one from below
            if (currentSection === 0) {
                carouselScrollProgress = 0;
                this.resetCarousel();
            }
        }
        
        this.updateSectionPosition();
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

    updateSectionPosition() {
        const offset = currentSection * -100;
        this.sectionContainer.style.transform = `translateY(${offset}vh)`;
        this.sectionContainer.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
    }

    goToImage(index) {
        if (index < 0 || index >= this.totalImages) return;
        
        const currentImage = this.images[this.currentImageIndex];
        const nextImage = this.images[index];
        
        // Animate transition
        this.animateTransition(currentImage, nextImage);
        
        // Update progress bar
        this.updateProgressBar(index);
        
        // Update current index
        this.currentImageIndex = index;
    }

    animateTransition(currentImage, nextImage) {
        // Phase 1: Close current image to center
        currentImage.classList.add('closing');
        
        setTimeout(() => {
            // Phase 2: Remove active from current, prepare next image
            currentImage.classList.remove('active', 'closing');
            nextImage.classList.add('opening');
            
            // Small delay to ensure the opening animation starts from center
            setTimeout(() => {
                nextImage.classList.add('active');
                
                // Clean up after animation completes
                setTimeout(() => {
                    nextImage.classList.remove('opening');
                }, 800);
            }, 50);
        }, 800);
    }

    updateProgressBar(index) {
        // Toggle between top and bottom positions
        if (index % 2 === 0) {
            this.progressBar.classList.remove('bottom');
            this.progressBar.classList.add('top');
        } else {
            this.progressBar.classList.remove('top');
            this.progressBar.classList.add('bottom');
        }
    }

    resetCarousel() {
        // Reset to first image
        this.images.forEach(img => img.classList.remove('active', 'closing', 'opening'));
        this.images[0].classList.add('active');
        this.currentImageIndex = 0;
        this.updateProgressBar(0);
    }

    loadNewImages(imageUrls) {
        // Stop auto-play if running
        this.stopAutoPlay();
        
        // Clear existing images
        const carouselTrack = document.querySelector('.carousel-track');
        carouselTrack.innerHTML = '';

        // Add new images
        imageUrls.forEach((url, index) => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = `Artwork ${index + 1}`;
            img.classList.add('carousel-image');
            if (index === 0) img.classList.add('active');
            carouselTrack.appendChild(img);
        });

        // Update references
        this.images = document.querySelectorAll('.carousel-image');
        this.totalImages = this.images.length;
        maxCarouselScrolls = this.totalImages;
        this.resetCarousel();
        
        // Restart auto-play if on mobile
        if (!isDesktop()) {
            this.startAutoPlay();
        }
    }
}

// Content Switcher for Section 2 clicks
class ContentSwitcher {
    constructor(carousel) {
        this.carousel = carousel;
        this.descriptionEl = document.querySelector('.description h2');
        this.descriptionText = document.querySelector('.description p');
        this.titleValue = document.querySelector('.flex-detail:nth-child(1) p');
        this.estimatedValue = document.querySelector('.flex-detail:nth-child(2) p');
        this.medium = document.querySelector('.flex-detail:nth-child(3) p');
        this.dimensions = document.querySelector('.flex-detail:nth-child(4) p');
        
        this.init();
    }

    init() {
        // Add click handlers to section 2 images
        const sectionTwoImages = document.querySelectorAll('.section-two .image-container');
        
        sectionTwoImages.forEach((container, index) => {
            container.style.cursor = 'pointer';
            container.addEventListener('click', () => {
                // Map index to artwork
                const artworkKeys = ['alhaja', 'boyPraying', 'colourGirl', 'boyLaugh'];
                const artworkKey = artworkKeys[index];
                
                if (artworkKey && artworkData[artworkKey]) {
                    this.switchContent(artworkKey);
                    
                    // Scroll behavior differs for desktop and mobile
                    if (isDesktop()) {
                        // Desktop: Use section positioning
                        currentSection = 0;
                        carouselScrollProgress = 0;
                        this.carousel.updateSectionPosition();
                    } else {
                        // Mobile: Use normal scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    switchContent(artworkKey) {
        const artwork = artworkData[artworkKey];
        
        // Update text content with fade effect
        this.fadeOutAndUpdate(this.descriptionEl, artwork.title);
        this.fadeOutAndUpdate(this.descriptionText, artwork.description);
        this.fadeOutAndUpdate(this.titleValue, artwork.title);
        this.fadeOutAndUpdate(this.estimatedValue, artwork.estimatedValue);
        this.fadeOutAndUpdate(this.medium, artwork.medium);
        this.fadeOutAndUpdate(this.dimensions, artwork.dimensions);
        
        // Update carousel images
        this.carousel.loadNewImages(artwork.images);
    }

    fadeOutAndUpdate(element, newText) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.opacity = '1';
        }, 300);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new ScrollCarousel();
    const contentSwitcher = new ContentSwitcher(carousel);
});
