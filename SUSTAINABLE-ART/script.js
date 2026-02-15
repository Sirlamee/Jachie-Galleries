// ==========================================
// MOBILE DETECTION
// ==========================================
const isMobile = () => {
    return window.matchMedia('(max-width: 768px)').matches || 
           ('ontouchstart' in window && window.innerWidth <= 768);
};

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
        }, { passive: true });
    }

    // ==========================================
    // SCROLLING TO TARGET SECTION
    // ==========================================
    scrollToSection(targetSection) {
        if (targetSection === this.currentSection || this.isAnimating) return;
        
        this.isAnimating = true;
        this.canScroll = false;

        const targetElement = this.sections[targetSection];
        
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });

            setTimeout(() => {
                this.currentSection = targetSection;
                this.isAnimating = false;
                
                setTimeout(() => {
                    this.canScroll = true;
                }, 100);

                // Trigger animations for the new section
                if (targetSection === 2) {
                    this.triggerSection2Animations();
                } else if (targetSection === 3) {
                    this.triggerSection3Animations();
                } else if (targetSection === 4) {
                    this.triggerSection4Animations();
                }
            }, 800);
        }
    }

    // ==========================================
    // SECTION 2: Setup and Text Transition
    // ==========================================
    setupSection2Elements() {
        this.fadeInText = this.sections[2]?.querySelector('.fade-in-text');
        this.showAfterScroll = this.sections[2]?.querySelector('.show-after-scroll');
    }

    triggerSection2Animations() {
        const imageContainer3 = this.sections[2]?.querySelector('.image-container-3');
        
        if (imageContainer3) {
            setTimeout(() => {
                imageContainer3.classList.add('reveal');
            }, 200);
        }

        // Show first text immediately
        if (this.fadeInText) {
            setTimeout(() => {
                this.fadeInText.classList.add('visible');
            }, 800);
        }
    }

    handleSection2TextTransition() {
        if (this.section2TextTransitioned) return;

        this.canScroll = false;
        
        if (this.fadeInText) {
            this.fadeInText.classList.add('slide-in');
        }
        
        setTimeout(() => {
            if (this.showAfterScroll) {
                this.showAfterScroll.classList.add('visible');
                this.showAfterScroll.classList.add('slide-in');
            }
            
            this.section2TextTransitioned = true;
            
            setTimeout(() => {
                this.canScroll = true;
            }, 500);
        }, 300);
    }

    handleSection2TextTransitionBack() {
        if (!this.section2TextTransitioned) return;

        this.canScroll = false;
        
        if (this.showAfterScroll) {
            this.showAfterScroll.classList.remove('visible');
            this.showAfterScroll.classList.remove('slide-in');
        }
        
        setTimeout(() => {
            this.section2TextTransitioned = false;
            
            setTimeout(() => {
                this.canScroll = true;
            }, 300);
        }, 300);
    }

    resetSection2() {
        this.section2TextTransitioned = false;
        if (this.fadeInText) {
            this.fadeInText.classList.remove('visible', 'slide-in');
        }
        if (this.showAfterScroll) {
            this.showAfterScroll.classList.remove('visible', 'slide-in');
        }
    }

    // ==========================================
    // SECTION 3: Setup and Horizontal Scroll
    // ==========================================
    setupSection3Elements() {
        this.scrollXContainer = this.sections[3]?.querySelector('.scrollX-card-container');
        this.scrollXCards = this.sections[3]?.querySelectorAll('.scrollX-card');
        this.section3Heading = this.sections[3]?.querySelector('.heading h1');
    }

    triggerSection3Animations() {
        if (this.section3Heading) {
            setTimeout(() => {
                this.section3Heading.classList.add('reveal');
            }, 200);
        }

        // Trigger first two cards immediately
        if (this.scrollXCards && this.scrollXCards.length > 0) {
            setTimeout(() => {
                this.scrollXCards[0]?.classList.add('reveal');
            }, 400);
            
            setTimeout(() => {
                this.scrollXCards[1]?.classList.add('reveal');
            }, 600);
        }
    }

    handleSection3Scroll() {
        this.canScroll = false;
        this.section3ScrollProgress++;

        const cardIndex = this.section3ScrollProgress + 1; // +1 because first 2 cards are already shown
        const card = this.scrollXCards[cardIndex];
        
        if (card && this.scrollXContainer) {
            card.classList.add('reveal');
            
            const cardWidth = card.offsetWidth;
            const gap = 32; // 2rem gap
            const scrollAmount = (cardWidth + gap) * this.section3ScrollProgress;
            
            this.scrollXContainer.style.transform = `translateX(-${scrollAmount}px)`;
        }

        setTimeout(() => {
            this.canScroll = true;
        }, 600);
    }

    handleSection3ScrollBack() {
        this.canScroll = false;
        this.section3ScrollProgress--;

        if (this.scrollXContainer) {
            const card = this.scrollXCards[0];
            const cardWidth = card.offsetWidth;
            const gap = 32;
            const scrollAmount = (cardWidth + gap) * this.section3ScrollProgress;
            
            this.scrollXContainer.style.transform = `translateX(-${scrollAmount}px)`;
        }

        setTimeout(() => {
            this.canScroll = true;
        }, 600);
    }

    resetSection3() {
        this.section3ScrollProgress = 0;
        if (this.scrollXContainer) {
            this.scrollXContainer.style.transform = 'translateX(0)';
        }
        // Remove reveal class from cards 3, 4, 5 only
        if (this.scrollXCards) {
            for (let i = 2; i < this.scrollXCards.length; i++) {
                this.scrollXCards[i].classList.remove('reveal');
            }
        }
    }

    // ==========================================
    // SECTION 4: Setup and Animations
    // ==========================================
    setupSection4Elements() {
        this.section4BgImage = this.sections[4]?.querySelector('.section-4-bg-image');
    }

    triggerSection4Animations() {
        // Only play animation once
        if (this.section4AnimationPlayed) return;
        
        if (this.section4BgImage) {
            setTimeout(() => {
                this.sections[4].classList.add('reveal');
                this.section4AnimationPlayed = true;
            }, 200);
        }
    }

    // ==========================================
    // ANIMATED TEXT SETUP (Section 4)
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
        }, {
            threshold: 0.5
        });

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
// MOBILE ANIMATION CONTROLLER (No Scroll Hijacking)
// ==========================================

class MobileAnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupHorizontalCardSwipe();
        this.showSection2Texts();
        this.loadSection4Background();
    }

    // Show both texts in Section 2 on mobile
    showSection2Texts() {
        const fadeInText = document.querySelector('.fade-in-text');
        const showAfterScroll = document.querySelector('.show-after-scroll');
        
        if (fadeInText) {
            fadeInText.classList.add('visible');
        }
        if (showAfterScroll) {
            showAfterScroll.classList.add('visible');
            showAfterScroll.classList.add('slide-in');
        }
    }

    // Load Section 4 background immediately
    loadSection4Background() {
        const section4 = document.querySelector('.section-4');
        if (section4) {
            section4.classList.add('reveal');
        }
    }

    // Setup scroll-triggered animations using IntersectionObserver
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(
            '.image-container-1, .image-container-2, .image-container-3, ' +
            '.scrollX-card, .section-3 .heading h1'
        );

        animatableElements.forEach(el => observer.observe(el));

        // Animated text observer
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

        const animatedTexts = document.querySelectorAll('.animated-text');
        animatedTexts.forEach(text => {
            const content = text.textContent;
            text.innerHTML = '';
            
            for (let i = 0; i < content.length; i++) {
                const span = document.createElement('span');
                span.textContent = content[i];
                if (content[i] === ' ') {
                    span.style.width = '0.25em';
                    span.innerHTML = '&nbsp;';
                }
                text.appendChild(span);
            }
            
            textObserver.observe(text);
        });
    }

    // Enable horizontal swipe for cards on mobile
    setupHorizontalCardSwipe() {
        const cardContainer = document.querySelector('.scrollX-card-container');
        if (!cardContainer) return;

        let startX = 0;
        let scrollLeft = 0;
        let isDown = false;

        cardContainer.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - cardContainer.offsetLeft;
            scrollLeft = cardContainer.scrollLeft;
        }, { passive: true });

        cardContainer.addEventListener('touchend', () => {
            isDown = false;
        }, { passive: true });

        cardContainer.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - cardContainer.offsetLeft;
            const walk = (x - startX) * 2;
            cardContainer.scrollLeft = scrollLeft - walk;
        }, { passive: false });

        // Enable smooth scrolling for card container
        cardContainer.style.overflowX = 'auto';
        cardContainer.style.scrollBehavior = 'smooth';
        cardContainer.style.webkitOverflowScrolling = 'touch';
    }
}

// ==========================================
// INITIALIZE ALL SYSTEMS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (isMobile()) {
        // Mobile: Use simple animation controller without scroll hijacking
        new MobileAnimationController();
        console.log('📱 Mobile Animations Initialized - Sustainable Art House');
    } else {
        // Desktop: Use full scroll hijacking system
        new ScrollHijacker();
        console.log('🖥️ Desktop Scroll Hijacking Initialized - Sustainable Art House');
    }
    
    // Initialize performance optimizer for both
    new PerformanceOptimizer();

    // Add animated-text class to section 4 h3
    const section4H3 = document.querySelector('.section-4 .section-content h3');
    if (section4H3) {
        section4H3.classList.add('animated-text');
    }
});

// ==========================================
// MOBILE OPTIMIZATION
// ==========================================

if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, { passive: true });
}

// ==========================================
// IMPROVED RESIZE HANDLER - NO RELOAD
// ==========================================

let currentDeviceType = isMobile() ? 'mobile' : 'desktop';
let resizeTimer;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newDeviceType = isMobile() ? 'mobile' : 'desktop';
        
        // Only reload if device type actually changed (mobile <-> desktop)
        if (currentDeviceType !== newDeviceType) {
            currentDeviceType = newDeviceType;
            location.reload();
        }
    }, 500);
});
