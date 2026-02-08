const images = [
  '../Assets/fineGirl.jpg',
  '../Assets/girlSleep.jpg',
  '../Assets/boyPraying.png',
  '../Assets/alhaja.jpg',
  '../Assets/fineGirl.jpg',
  '../Assets/colourGirll.png'
];

const loaderImage = document.getElementById('loader-image');
const transitionOverlay = document.querySelector('.transition-overlay');

// Animation function
function runImageSequence() {
  let currentIndex = 1; // Start from 1 since first image is already visible
  const delay = 200; // 0.2s in milliseconds

  function showNextImage() {
    if (currentIndex < images.length) {
      // Wait for delay, then change image
      setTimeout(() => {
        loaderImage.src = images[currentIndex];
        currentIndex++;
        showNextImage(); // Recursively call for next image
      }, delay);
    } else {
      // All images shown, hold last image for 1 second
      setTimeout(() => {
        expandOverlay();
      }, 1000);
    }
  }

  showNextImage();
}

// Expand overlay animation
function expandOverlay() {
  if (!transitionOverlay) return;
  
  transitionOverlay.style.transition = 'height 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
  transitionOverlay.style.height = '100%';

  // Navigate after animation completes
  setTimeout(() => {
    window.location.href = '../LANDING-PAGE/index.html';
  }, 800); // 0.8s animation duration
}

// Start animation after page load with 2 second delay
window.addEventListener('load', () => {
  setTimeout(() => {
    runImageSequence();
  }, 2000); // 2 second delay
});