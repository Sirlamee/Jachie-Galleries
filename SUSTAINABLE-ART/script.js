// ==========================================
// SCROLL HIJACKING & SECTION SNAPPING SYSTEM
// ==========================================

class ScrollHijacker {
    constructor() {
        this.currentSection = 1;
        this.isAnimating = false;
        this.canScroll = true;
        this.section2TextTransitioned = false;
        this.section3ScrollProgress = 0;
        this.section3MaxScrolls = 3;
        this.scrollTimeout = null;
        this.section4AnimationPlayed = false; // Track if section 4 animation has played
        
        this.sections = {
            1: document.querySelector('.section-1'),
            2: document.querySelector('.section-2'),
            3: document.querySelector('.section-3'),
            4: document.querySelector('.section-4'),
            5: document.querySelector('.footer')
        };

        this.init();
    }

    init() {
        this.setupSection1Animations();
        this.setupSection2Elements();
        this.setupSection3Elements();
        this.setupSection4Elements();
        this.setupAnimatedText();
        this.setupScrollListener();
        this.detectCurrentSection();
    }

    // ==========================================
    // DETECT CURRENT SECTION ON LOAD/SCROLL
    // ==========================================
    detectCurrentSection() {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        if (scrollY < vh * 0.5) {
            this.currentSection = 1;
        } else if (scrollY < vh * 1.5) {
            this.currentSection = 2;
            this.triggerSection2Animations();
        } else if (scrollY < vh * 2.5) {
            this.currentSection = 3;
            this.triggerSection3Animations();
        } else if (scrollY < vh * 3.5) {
            this.currentSection = 4;
            this.triggerSection4Animations();
        } else {
            this.currentSection = 5;
        }
    }

    // ==========================================
    // SECTION 1: Basic Reveal Animations
    // ==========================================
    setupSection1Animations() {
        const imageContainer1 = this.sections[1]?.querySelector('.image-container-1');
        const imageContainer2 = this.sections[1]?.querySelector('.image-container-2');

        if (imageContainer1 && imageContainer2) {
            setTimeout(() => {
                imageContainer1.classList.add('reveal');
                imageContainer2.classList.add('reveal');
            }, 300);
        }
    }

    // ==========================================
    // MAIN SCROLL LISTENER WITH HIJACKING + SNAPPING
    // ==========================================
    setupScrollListener() {
        const handleWheel = (e) => {
            if (!this.canScroll || this.isAnimating) {
                e.preventDefault();
                return;
            }

            const direction = e.deltaY > 0 ? 'down' : 'up';
            
            // SECTION 2: Handle text transitions with scroll up/down support
            if (this.currentSection === 2) {
                // Scrolling down on first text - show second text
                if (!this.section2TextTransitioned && direction === 'down') {
                    e.preventDefault();
                    this.handleSection2TextTransition();
                    return;
                }

                // Scrolling up on second text - show first text
                if (this.section2TextTransitioned && direction === 'up') {
                    e.preventDefault();
                    this.handleSection2TextTransitionBack();
                    return;
                }

                // Scrolling up on first text - go to section 1
                if (!this.section2TextTransitioned && direction === 'up') {
                    e.preventDefault();
                    this.scrollToSection(1);
                    return;
                }

                // Scrolling down on second text - go to section 3
                if (this.section2TextTransitioned && direction === 'down') {
                    e.preventDefault();
                    this.resetSection2(); // Reset section 2 state
                    this.scrollToSection(3);
                    return;
                }
            }

            // SECTION 3: Hijack scrolls for horizontal card movement
            if (this.currentSection === 3 && direction === 'down') {
                e.preventDefault();
                
                if (this.section3ScrollProgress < this.section3MaxScrolls) {
                    this.handleSection3Scroll();
                } else {
                    // All cards shown, go to section 4 and reset section 3
                    this.resetSection3();
                    this.scrollToSection(4);
                }
                return;
            }

            // SECTION 3: Allow scrolling back
            if (this.currentSection === 3 && direction === 'up') {
                e.preventDefault();
                
                if (this.section3ScrollProgress > 0) {
                    this.handleSection3ScrollBack();
                } else {
                    // At start of cards, go back to section 2 and reset section 3
                    this.resetSection3();
                    this.scrollToSection(2);
                }
                return;
            }

            // OTHER SECTIONS: Normal section snapping
            if (direction === 'down') {
                e.preventDefault();
                if (this.currentSection < 5) {
                    this.scrollToSection(this.currentSection + 1);
                }
            } else {
                e.preventDefault();
                if (this.currentSection > 1) {
                    this.scrollToSection(this.currentSection - 1);
                }
            }
        };

        // Mouse wheel with debouncing
        window.addEventListener('wheel', handleWheel, { passive: false });

        // Touch support for mobile
        let touchStartY = 0;
        let touchEndY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            if (!this.canScroll || this.isAnimating) return;

            touchEndY = e.changedTouches[0].screenY;
            const diff = touchStartY - touchEndY;
            
            // Require minimum swipe distance
            if (Math.abs(diff) < 50) return;
            
            const direction = diff > 0 ? 'down' : 'up';
            
            // Section 2 hijack for touch with bi-directional support
            if (this.currentSection === 2) {
                if (!this.section2TextTransitioned && direction === 'down') {
                    this.handleSection2TextTransition();
                    return;
                }

                if (this.section2TextTransitioned && direction === 'up') {
                    this.handleSection2TextTransitionBack();
                    return;
                }

                if (!this.section2TextTransitioned && direction === 'up') {
                    this.scrollToSection(1);
                    return;
                }

                if (this.section2TextTransitioned && direction === 'down') {
                    this.resetSection2();
                    this.scrollToSection(3);
                    return;
                }
            }

            // Section 3 hijack for touch
            if (this.currentSection === 3 && direction === 'down') {
                if (this.section3ScrollProgress < this.section3MaxScrolls) {
                    this.handleSection3Scroll();
                } else {
                    this.resetSection3();
                    this.scrollToSection(4);
                }
                return;
            }

            if (this.currentSection === 3 && direction === 'up') {
                if (this.section3ScrollProgress > 0) {
                    this.handleSection3ScrollBack();
                } else {
                    this.resetSection3();
                    this.scrollToSection(2);
                }
                return;
            }

            // Normal section navigation
            if (direction === 'down' && this.currentSection < 5) {
                this.scrollToSection(this.currentSection + 1);
            } else if (direction === 'up' && this.currentSection > 1) {
                this.scrollToSection(this.currentSection - 1);
            }
        });
    }

    // ==========================================
    // SMOOTH SCROLL TO SECTION
    // ==========================================
    scrollToSection(sectionNumber) {
        if (this.isAnimating || !this.canScroll) return;
        
        this.isAnimating = true;
        this.canScroll = false;
        
        const targetSection = this.sections[sectionNumber];
        if (!targetSection) {
            this.isAnimating = false;
            this.canScroll = true;
            return;
        }

        const targetY = targetSection.offsetTop;
        
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });

        this.currentSection = sectionNumber;

        // Trigger animations for the target section
        setTimeout(() => {
            if (sectionNumber === 2) {
                this.triggerSection2Animations();
            } else if (sectionNumber === 3) {
                this.triggerSection3Animations();
            } else if (sectionNumber === 4) {
                this.triggerSection4Animations();
            }
        }, 300);

        // Re-enable scrolling
        setTimeout(() => {
            this.isAnimating = false;
            this.canScroll = true;
        }, 1000);
    }

    // ==========================================
    // SECTION 2: Setup, Animations, and Transitions
    // ==========================================
    setupSection2Elements() {
        this.imageContainer3 = this.sections[2]?.querySelector('.image-container-3');
        this.fadeInText = this.sections[2]?.querySelector('.fade-in-text');
        this.showAfterScroll = this.sections[2]?.querySelector('.show-after-scroll');
    }

    triggerSection2Animations() {
        if (this.imageContainer3 && !this.imageContainer3.classList.contains('reveal')) {
            this.imageContainer3.classList.add('reveal');
            
            setTimeout(() => {
                if (this.fadeInText) {
                    this.fadeInText.classList.add('visible');
                }
            }, 600);
        } else {
            // If image is already revealed, just show the first text immediately
            if (this.fadeInText && !this.section2TextTransitioned) {
                this.fadeInText.classList.add('visible');
            }
        }
    }

    handleSection2TextTransition() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.canScroll = false;

        // Fade out first text
        if (this.fadeInText) {
            this.fadeInText.classList.remove('visible');
        }

        // Slide in second text to same position
        if (this.showAfterScroll) {
            setTimeout(() => {
                this.showAfterScroll.classList.add('visible');
                this.showAfterScroll.classList.add('slide-in');
            }, 400);
        }

        this.section2TextTransitioned = true;

        setTimeout(() => {
            this.isAnimating = false;
            this.canScroll = true;
        }, 1000);
    }

    handleSection2TextTransitionBack() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.canScroll = false;

        // Fade out second text
        if (this.showAfterScroll) {
            this.showAfterScroll.classList.remove('visible');
            this.showAfterScroll.classList.remove('slide-in');
        }

        // Fade in first text
        if (this.fadeInText) {
            setTimeout(() => {
                this.fadeInText.classList.add('visible');
            }, 400);
        }

        this.section2TextTransitioned = false;

        setTimeout(() => {
            this.isAnimating = false;
            this.canScroll = true;
        }, 1000);
    }

    resetSection2() {
        // Reset section 2 to first text state
        if (this.showAfterScroll) {
            this.showAfterScroll.classList.remove('visible');
            this.showAfterScroll.classList.remove('slide-in');
        }
        
        // Show the first text again
        if (this.fadeInText) {
            this.fadeInText.classList.add('visible');
        }
        
        this.section2TextTransitioned = false;
    }

    // ==========================================
    // SECTION 3: Setup and Animations
    // ==========================================
    setupSection3Elements() {
        this.cardContainer = this.sections[3]?.querySelector('.scrollX-card-container');
        this.cards = this.sections[3]?.querySelectorAll('.scrollX-card');
        this.heading = this.sections[3]?.querySelector('.heading h1');
        
        // Calculate max scroll distance
        if (this.cardContainer) {
            const containerWidth = this.cardContainer.scrollWidth;
            const viewportWidth = window.innerWidth;
            this.maxTranslateX = -(containerWidth - viewportWidth + 100);
        }
    }

    triggerSection3Animations() {
        if (this.heading && !this.heading.classList.contains('reveal')) {
            this.heading.classList.add('reveal');

            setTimeout(() => {
                this.cards?.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('reveal');
                    }, index * 150);
                });
            }, 300);
        }
    }

    handleSection3Scroll() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.canScroll = false;

        this.section3ScrollProgress++;
        
        const progress = this.section3ScrollProgress / this.section3MaxScrolls;
        const translateX = this.maxTranslateX * progress;
        
        if (this.cardContainer) {
            this.cardContainer.style.transform = `translateX(${translateX}px)`;
        }

        setTimeout(() => {
            this.isAnimating = false;
            this.canScroll = true;
        }, 400);
    }

    handleSection3ScrollBack() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.canScroll = false;

        this.section3ScrollProgress--;
        
        const progress = this.section3ScrollProgress / this.section3MaxScrolls;
        const translateX = this.maxTranslateX * progress;
        
        if (this.cardContainer) {
            this.cardContainer.style.transform = `translateX(${translateX}px)`;
        }

        setTimeout(() => {
            this.isAnimating = false;
            this.canScroll = true;
        }, 400);
    }

    resetSection3() {
        // Reset horizontal scroll position
        this.section3ScrollProgress = 0;
        if (this.cardContainer) {
            this.cardContainer.style.transform = 'translateX(0px)';
        }
    }

    // ==========================================
    // SECTION 4: Background Reveal
    // ==========================================
    setupSection4Elements() {
        // Remove reveal class initially to ensure animation is ready
        if (this.sections[4]) {
            this.sections[4].classList.remove('reveal');
        }
    }

    triggerSection4Animations() {
        // Only trigger animation if it hasn't played yet
        if (this.sections[4] && !this.section4AnimationPlayed) {
            // Small delay to ensure animation triggers properly
            setTimeout(() => {
                this.sections[4].classList.add('reveal');
                this.section4AnimationPlayed = true; // Mark as played, never reset
            }, 100);
        }
    }

    // ==========================================
    // ANIMATED TEXT (Letter by Letter)
    // ==========================================
    setupAnimatedText() {
        const animatedTexts = document.querySelectorAll('.animated-text');

        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach((span, index) => {
                        setTimeout(() => {
                            span.classList.add('revealed');
                        }, index * 30);
                    });
                    textObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        animatedTexts.forEach(animatedText => {
            const text = animatedText.textContent;
            animatedText.innerHTML = '';

            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.textContent = text[i];
                
                if (text[i] === ' ') {
                    span.style.width = '0.25em';
                    span.innerHTML = '&nbsp;';
                }
                
                animatedText.appendChild(span);
            }

            textObserver.observe(animatedText);
        });
    }
}

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.addWillChangeHints();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    imageObserver.unobserve(entry.target);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    addWillChangeHints() {
        const animatedElements = document.querySelectorAll(
            '.scrollX-card-container, .image-container-3, .section-4'
        );

        animatedElements.forEach(el => {
            el.style.willChange = 'transform';
        });

        setTimeout(() => {
            animatedElements.forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 5000);
    }
}

// ==========================================
// INITIALIZE ALL SYSTEMS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll hijacker (main controller)
    new ScrollHijacker();
    
    // Initialize performance optimizer
    new PerformanceOptimizer();

    // Add animated-text class to section 4 h3
    const section4H3 = document.querySelector('.section-4 .section-content h3');
    if (section4H3) {
        section4H3.classList.add('animated-text');
    }

    console.log('🎨 Scroll Snapping + Hijacking Initialized - Sustainable Art House');
});

// ==========================================
// MOBILE OPTIMIZATION
// ==========================================

if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, { passive: true });
}

// ==========================================
// RESIZE HANDLER
// ==========================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        location.reload();
    }, 500);
});
