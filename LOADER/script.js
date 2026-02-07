const images = [
  '../Assets/fineGirl.jpg',
  '../Assets/girlSleep.jpg',
  '../Assets/boyPraying.png',
  '../Assets/alhaja.jpg',
  '../Assets/fineGirl.jpg',
  '../Assets/colourGirll.png'
];

const loaderImage = document.getElementById('loader-image');

// Create GSAP timeline
const tl = gsap.timeline({ paused: true });

// Loop through images and add animations
images.forEach((img, index) => {
  if (index === 0) return; // first image already visible

  // Show previous image for a bit, then swap instantly
  tl.to({}, { duration: 0.2 });

  tl.call(() => {
    loaderImage.src = img;
  });
});

// Hold the last image for a moment (1 second)
tl.to({}, { duration: 1 });

// After last image → expand white overlay from bottom to top
tl.to(".transition-overlay", {
  height: "100%",
  duration: 0.8,
  ease: "power2.inOut",
  onComplete: () => {
    window.location.href = '../LANDING-PAGE/index.html';
  }
});

// Start animation after page load
window.addEventListener('load', () => {
  gsap.delayedCall(2, () => {
    tl.play();
  });
});
