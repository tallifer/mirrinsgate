// loader.js
function preloadImages(images, callback) {
  let loaded = 0;
  const total = images.length;

  images.forEach(src => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loaded++;
      if (loaded === total) callback();
    };
    img.src = src;
  });
}

// Initialize loader
function initLoader(imagesToPreload, contentSelector) {
  document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const content = document.querySelector(contentSelector);
    if (content) content.style.visibility = 'hidden';

    preloadImages(imagesToPreload, () => {
      // Fade out the loading screen
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        if (content) content.style.visibility = 'visible';
      }, 500);
    });
  });
}
