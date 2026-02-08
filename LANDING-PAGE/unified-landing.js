// ==========================================
// UNIFIED LANDING PAGE SCRIPT
// Desktop: Full scroll hijacking
// Mobile: Native scroll with optimized interactions
// ==========================================

// ==========================================
// MOBILE DETECTION
// ==========================================
const isMobile = () => {
    return window.matchMedia('(max-width: 768px)').matches || 
           ('ontouchstart' in window && window.innerWidth <= 768);
};

// ==========================================
// CAROUSEL CONTROLLER (Works on Both Desktop & Mobile)
// ==========================================
const CarouselController = {
    slides: document.querySelectorAll('.slide'),
    loadingBar: document.querySelector('.loading-bar'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    controlBtn: document.getElementById('controlBtn'),
    pauseIcon: document.getElementById('pauseIcon'),
    playIcon: document.getElementById('playIcon'),
    
    currentSlide: 0,
    isPlaying: true,
    loadingProgress: 0,
    loadingInterval: null,
    transitionDuration: 5000,
    loadingSpeed: 100,
    
    init() {
        if (!this.slides.length) return;
        
        this.progressIncrement = (100 / (this.transitionDuration / this.loadingSpeed));
        this.setupEventListeners();
        this.startLoading();
    },
    
    startLoading() {
        if (!this.isPlaying) return;
        
        this.loadingProgress = 0;
        if (this.loadingBar) this.loadingBar.style.width = '0%';

        this.loadingInterval = setInterval(() => {
            if (!this.isPlaying) return;

            this.loadingProgress += this.progressIncrement;
            if (this.loadingBar) this.loadingBar.style.width = this.loadingProgress + '%';

            if (this.loadingProgress >= 100) {
                clearInterval(this.loadingInterval);
                this.nextSlide();
            }
        }, this.loadingSpeed);
    },
    
    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add('prev');

        this.currentSlide = index;

        this.slides[this.currentSlide].classList.add('active');
        this.slides[this.currentSlide].classList.remove('prev');

        this.slides.forEach((slide, i) => {
            if (i !== this.currentSlide && i !== (this.currentSlide - 1 + this.slides.length) % this.slides.length) {
                slide.classList.remove('prev');
            }
        });

        clearInterval(this.loadingInterval);
        if (this.isPlaying) {
            this.startLoading();
        } else {
            if (this.loadingBar) this.loadingBar.style.width = '0%';
        }
    },
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    },
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    },
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        
        if (this.isPlaying) {
            if (this.pauseIcon) this.pauseIcon.style.display = 'block';
            if (this.playIcon) this.playIcon.style.display = 'none';
            this.startLoading();
        } else {
            if (this.pauseIcon) this.pauseIcon.style.display = 'none';
            if (this.playIcon) this.playIcon.style.display = 'block';
            clearInterval(this.loadingInterval);
        }
    },
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.controlBtn) {
            this.controlBtn.addEventListener('click', () => this.togglePlayPause());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.stopPropagation();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.stopPropagation();
                this.nextSlide();
            } else if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                this.togglePlayPause();
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    },
    
    handleSwipe(touchStartX, touchEndX) {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            this.nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            this.prevSlide();
        }
    }
};

// ==========================================
// NAVBAR SWITCHER (Works on Both)
// ==========================================
const NavbarController = {
    heroNavbar: document.querySelector('.hero-navbar'),
    stickyNavbar: document.querySelector('.sticky-navbar'),
    
    update(currentSection) {
        if (currentSection > 0) {
            this.heroNavbar?.classList.add('hidden');
            this.stickyNavbar?.classList.add('visible');
        } else {
            this.heroNavbar?.classList.remove('hidden');
            this.stickyNavbar?.classList.remove('visible');
        }
    }
};

// ==========================================
// DESKTOP SCROLL HIJACKER
// ==========================================
class DesktopScrollHijacker {
    constructor() {
        this.isScrolling = false;
        this.currentSection = 0;
        this.sections = document.querySelectorAll('section');
        this.sectionContainer = document.querySelector('.section-container');
        
        // Third section
        this.thirdSectionScrollProgress = 0;
        this.currentSubsection = 0;
        this.totalSubsections = 3;
        this.hasTriggeredImageAnimation = false;
        this.subsections = document.querySelectorAll('.subsection');
        this.imageContainer = document.querySelector('.animated-image-container');
        
        // Gallery section
        this.galleryScrollProgress = 0;
        this.maxGalleryScrolls = 5;
        this.gallerySection = document.getElementById('gallery-section');
        this.imageItems = document.querySelectorAll('.image-item');
        
        this.init();
    }
    
    init() {
        // Disable default scrolling
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        this.setupWheelListener();
        this.updateSubsection(0);
        this.updateSectionPosition();
        this.updateGalleryImages();
    }
    
    updateSectionPosition() {
        const offset = this.currentSection * -100;
        this.sectionContainer.style.transform = `translateY(${offset}vh)`;
    }
    
    updateSubsection(index) {
        this.subsections.forEach((subsection, i) => {
            if (i === index) {
                subsection.classList.remove('fading-out');
                subsection.classList.add('active');
            } else {
                if (subsection.classList.contains('active')) {
                    subsection.classList.add('fading-out');
                }
                subsection.classList.remove('active');
            }
        });
    }
    
    triggerImageAnimation() {
        if (!this.hasTriggeredImageAnimation && this.imageContainer) {
            this.imageContainer.classList.add('animate');
            this.hasTriggeredImageAnimation = true;
        }
    }
    
    updateGalleryImages() {
        if (!this.imageItems.length) return;

        this.imageItems.forEach(item => {
            item.classList.remove('hidden', 'reveal-1', 'reveal-2', 'reveal-3', 'reveal-4', 'reveal-5');

            if (this.galleryScrollProgress === 0) {
                item.classList.add('hidden');
            } else if (this.galleryScrollProgress >= 1 && this.galleryScrollProgress <= 5) {
                item.classList.add(`reveal-${this.galleryScrollProgress}`);
            }
        });
    }
    
    setupWheelListener() {
        window.addEventListener('wheel', (e) => {
            e.preventDefault();

            if (this.isScrolling) return;

            const scrollDirection = e.deltaY > 0 ? 'down' : 'up';

            // Handle Third Section (Vision Pillars)
            const isInThirdSection = this.currentSection === 2;
            
            if (isInThirdSection) {
                if (scrollDirection === 'down' && this.currentSubsection < this.totalSubsections - 1) {
                    this.isScrolling = true;
                    this.currentSubsection++;
                    this.updateSubsection(this.currentSubsection);
                    setTimeout(() => { this.isScrolling = false; }, 800);
                    return;
                } else if (scrollDirection === 'up' && this.currentSubsection > 0) {
                    this.isScrolling = true;
                    this.currentSubsection--;
                    this.updateSubsection(this.currentSubsection);
                    setTimeout(() => { this.isScrolling = false; }, 800);
                    return;
                }
            }

            // Handle Gallery Section
            const isInGallerySection = this.currentSection === 4 && this.gallerySection;
            
            if (isInGallerySection) {
                this.isScrolling = true;

                if (scrollDirection === 'down') {
                    if (this.galleryScrollProgress < this.maxGalleryScrolls) {
                        this.galleryScrollProgress++;
                        this.updateGalleryImages();
                        setTimeout(() => { this.isScrolling = false; }, 600);
                        return;
                    } else if (this.galleryScrollProgress === this.maxGalleryScrolls && this.currentSection < this.sections.length - 1) {
                        this.currentSection++;
                        this.updateSectionPosition();
                        this.galleryScrollProgress = 0;
                        setTimeout(() => { this.isScrolling = false; }, 800);
                        return;
                    }
                } else if (scrollDirection === 'up') {
                    if (this.galleryScrollProgress > 0) {
                        this.galleryScrollProgress--;
                        this.updateGalleryImages();
                        setTimeout(() => { this.isScrolling = false; }, 600);
                        return;
                    } else if (this.galleryScrollProgress === 0 && this.currentSection > 0) {
                        this.currentSection--;
                        this.updateSectionPosition();
                        setTimeout(() => { this.isScrolling = false; }, 800);
                        return;
                    }
                }
            }

            // Normal section scrolling
            this.isScrolling = true;

            if (e.deltaY > 0 && this.currentSection < this.sections.length - 1) {
                this.currentSection++;

                if (this.currentSection === 2) {
                    this.triggerImageAnimation();
                }
                if (this.currentSection === 3) {
                    this.currentSubsection = 0;
                    this.updateSubsection(0);
                    this.hasTriggeredImageAnimation = false;
                    if (this.imageContainer) this.imageContainer.classList.remove('animate');
                }
                if (this.currentSection === 4 && this.gallerySection) {
                    this.galleryScrollProgress = 0;
                    this.updateGalleryImages();
                }
            } else if (e.deltaY < 0 && this.currentSection > 0) {
                this.currentSection--;

                if (this.currentSection === 2) {
                    this.triggerImageAnimation();
                }
                if (this.currentSection === 4 && this.gallerySection) {
                    this.galleryScrollProgress = 0;
                    this.updateGalleryImages();
                }
            }

            this.updateSectionPosition();
            NavbarController.update(this.currentSection);

            setTimeout(() => {
                this.isScrolling = false;
            }, 800);
        }, { passive: false });
    }
}

// ==========================================
// MOBILE ANIMATION CONTROLLER
// ==========================================
class MobileAnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        this.enableNativeScroll();
        this.setupIntersectionObservers();
        this.setupVisionPillarsSwipe();
        this.setupScrollBasedNavbar();
    }
    
    enableNativeScroll() {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }
    
    setupScrollBasedNavbar() {
        const sections = document.querySelectorAll('section');
        
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(sections).indexOf(entry.target);
                    NavbarController.update(sectionIndex);
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => navObserver.observe(section));
    }
    
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        // Animate elements on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe third section image
        const imageContainer = document.querySelector('.animated-image-container');
        if (imageContainer) observer.observe(imageContainer);

        // Gallery progressive reveal
        this.setupGalleryReveal();
    }
    
    setupGalleryReveal() {
        const imageItems = document.querySelectorAll('.image-item');
        if (!imageItems.length) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = Array.from(imageItems).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.classList.remove('hidden');
                        entry.target.classList.add('reveal-mobile');
                    }, delay);
                }
            });
        }, { threshold: 0.2 });

        imageItems.forEach(item => revealObserver.observe(item));
    }
    
    setupVisionPillarsSwipe() {
        const subsectionsContainer = document.querySelector('.subsections-container');
        const subsections = document.querySelectorAll('.subsection');
        const dotsContainer = this.createDotsIndicator(subsections.length);
        
        if (!subsectionsContainer || !subsections.length) return;

        let currentIndex = 0;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        // Make container horizontally scrollable
        subsectionsContainer.style.display = 'flex';
        subsectionsContainer.style.overflow = 'hidden';
        subsectionsContainer.style.position = 'relative';
        
        subsections.forEach((subsection, index) => {
            subsection.style.minWidth = '100%';
            subsection.style.flexShrink = '0';
            if (index === 0) subsection.classList.add('active');
        });

        const updatePosition = (index) => {
            const offset = -index * 100;
            subsectionsContainer.style.transform = `translateX(${offset}%)`;
            subsectionsContainer.style.transition = 'transform 0.3s ease';
            
            // Update dots
            this.updateDots(dotsContainer, index);
            
            // Update active state
            subsections.forEach((sub, i) => {
                if (i === index) {
                    sub.classList.add('active');
                } else {
                    sub.classList.remove('active');
                }
            });
        };

        // Touch events
        subsectionsContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            subsectionsContainer.style.transition = 'none';
        });

        subsectionsContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const offset = -currentIndex * 100 + (diff / window.innerWidth * 100);
            subsectionsContainer.style.transform = `translateX(${offset}%)`;
        });

        subsectionsContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const diff = currentX - startX;
            const threshold = 50;

            if (diff > threshold && currentIndex > 0) {
                currentIndex--;
            } else if (diff < -threshold && currentIndex < subsections.length - 1) {
                currentIndex++;
            }

            updatePosition(currentIndex);
        });

        // Initialize
        updatePosition(0);
    }
    
    createDotsIndicator(count) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'vision-dots-mobile';
        dotsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
        `;
        
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = 'vision-dot';
            dot.style.cssText = `
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transition: all 0.3s ease;
            `;
            if (i === 0) {
                dot.style.background = '#fff';
                dot.style.width = '24px';
                dot.style.borderRadius = '4px';
            }
            dotsContainer.appendChild(dot);
        }
        
        const thirdSection = document.querySelector('.third-section');
        if (thirdSection) thirdSection.appendChild(dotsContainer);
        
        return dotsContainer;
    }
    
    updateDots(dotsContainer, activeIndex) {
        const dots = dotsContainer.querySelectorAll('.vision-dot');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.style.background = '#fff';
                dot.style.width = '24px';
                dot.style.borderRadius = '4px';
            } else {
                dot.style.background = 'rgba(255, 255, 255, 0.5)';
                dot.style.width = '8px';
                dot.style.borderRadius = '50%';
            }
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Carousel (works on both)
    CarouselController.init();
    
    // Initialize based on device
    if (isMobile()) {
        console.log('📱 Mobile Mode - Native Scroll with Enhanced Interactions');
        new MobileAnimationController();
    } else {
        console.log('🖥️ Desktop Mode - Full Scroll Hijacking');
        new DesktopScrollHijacker();
    }
});

// Export for external use if needed
window.updateNavbarVisibility = (currentSection) => {
    NavbarController.update(currentSection);
};
