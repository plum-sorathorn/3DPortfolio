import * as THREE from 'three';
import { store } from './store.js';

/* LOADING OF VIDEO TEXTURES */
// load in video for hologram screen
store.holoVideo = document.createElement("video");
store.holoVideo.src = "/textures/videos/holoscreen2.mp4";
store.holoVideo.loop = true;
store.holoVideo.muted = true;
store.holoVideo.autoplay = true;

const playHoloVideo = () => {
  store.holoVideo.play().catch(err => console.error("Error playing holo video:", err));
};
setTimeout(playHoloVideo, 500);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) store.holoVideo.pause();
  else store.holoVideo.play().catch(err => console.error("Holo Autoplay prevented:", err));
});

store.holoVideoTexture = new THREE.VideoTexture(store.holoVideo);
store.holoVideoTexture.colorSpace = THREE.SRGBColorSpace;