const musicButton = document.getElementById('musicToggle');
if (musicButton) {
  let musicOn = true;
  musicButton.addEventListener('click', () => {
    musicOn = !musicOn;
    musicButton.src = musicOn ? 'icons/icon_unmute.webp' : 'icons/icon_mute.webp';
    // Here you would also toggle your game's audio
  });
}
