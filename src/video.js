import * as THREE from 'three';
import { store } from './store.js';

/* LOADING OF VIDEO TEXTURES */
// load in video for hologram screen
store.holoVideo = document.createElement("video");
store.holoVideo.src = "textures/videos/holoscreen2.mp4";
store.holoVideo.loop = true;
store.holoVideo.muted = true;
store.holoVideo.playsInline = true;

store.holoVideo.oncanplaythrough = () => {
    store.holoVideo.play().catch(err => {
        console.warn("Initial autoplay prevented by browser. User interaction needed:", err);
    });
    store.holoVideo.oncanplaythrough = null;
};

document.addEventListener("visibilitychange", () => {
  if (document.hidden) store.holoVideo.pause();
  else store.holoVideo.play().catch(err => console.warn("Holo Autoplay prevented (visibility change):", err));
});

store.holoVideoTexture = new THREE.VideoTexture(store.holoVideo);
store.holoVideoTexture.colorSpace = THREE.SRGBColorSpace;