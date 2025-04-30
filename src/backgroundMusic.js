import { Howl } from 'howler';

// Create a Howl instance for background music
const backgroundMusic = new Howl({
    src: ['/music/nightstroll.mp3'],
    volume: 0.6,
    loop: true,  // Enable looping for background music
    preload: true,
  });
  
// Functions to control music
export function playMusic() {
if (!backgroundMusic.playing()) {
    backgroundMusic.play();
}
}