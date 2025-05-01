import { Howl } from 'howler';

// Create a Howl instance for background music
const backgroundMusic = new Howl({
    src: ['/music/finalstroll.mp3'],
    volume: 0.5,
    loop: true,
    preload: true,
  });
  
// Functions to control music
export function playMusic() {
if (!backgroundMusic.playing()) {
    backgroundMusic.play();
}
}