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

function initLoader(imagesToPreload, contentSelector, onComplete = null, showSpinner = true) {
  const loadingScreen = document.getElementById('loadingScreen');
  const content = document.querySelector(contentSelector);

  if (content) content.style.visibility = 'hidden';

  if (showSpinner && loadingScreen) {
    loadingScreen.style.display = 'flex';
  }

  preloadImages(imagesToPreload, () => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        if (content) content.style.visibility = 'visible';
        if (onComplete) onComplete();
      }, 500);
    } else {
      if (content) content.style.visibility = 'visible';
      if (onComplete) onComplete();
    }
  });
}
