// Carousel namespace to avoid conflicts
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
  transitionDuration: 5000, // 5 seconds per slide
  loadingSpeed: 100, // Update every 100ms
  
  init() {
    if (!this.slides.length) return; // Exit if no carousel on page
    
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
    // Remove active class from current slide
    this.slides[this.currentSlide].classList.remove('active');
    this.slides[this.currentSlide].classList.add('prev');

    // Update current slide index
    this.currentSlide = index;

    // Add active class to new slide
    this.slides[this.currentSlide].classList.add('active');
    this.slides[this.currentSlide].classList.remove('prev');

    // Remove prev class from all slides except the previous one
    this.slides.forEach((slide, i) => {
      if (i !== this.currentSlide && i !== (this.currentSlide - 1 + this.slides.length) % this.slides.length) {
        slide.classList.remove('prev');
      }
    });

    // Reset and restart loading bar
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
    // Button listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    if (this.controlBtn) {
      this.controlBtn.addEventListener('click', () => this.togglePlayPause());
    }

    // Keyboard navigation (only for carousel-specific keys)
    document.addEventListener('keydown', (e) => {
      // Only handle left/right arrows if carousel exists
      if (e.key === 'ArrowLeft') {
        e.stopPropagation(); // Prevent bubbling to other handlers
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.stopPropagation(); // Prevent bubbling to other handlers
        this.nextSlide();
      } else if (e.key === ' ' && e.target === document.body) {
        // Only handle spacebar if not in an input/textarea
        e.preventDefault();
        this.togglePlayPause();
      }
    });

    // Touch swipe support
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

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CarouselController.init());
} else {
  CarouselController.init();
}
