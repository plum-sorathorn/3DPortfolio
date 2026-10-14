import { Howl } from 'howler';

// Create a Howl instance for background music (lazy loaded on user interaction)
const backgroundMusic = new Howl({
  src: ['/music/finalstroll.mp3'],
  volume: 0.5,
  loop: true,
  preload: false,
  html5: true,
});

// Functions to control music
export function playMusic() {
  if (!backgroundMusic.playing()) {
    backgroundMusic.play();
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (backgroundMusic.playing()) {
      backgroundMusic.pause();
      backgroundMusic._wasPlaying = true;
    }
  } else if (backgroundMusic._wasPlaying) {
    backgroundMusic._wasPlaying = false;
    backgroundMusic.play();
  }
});