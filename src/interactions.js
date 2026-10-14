import { store } from './store.js';
import { showIframe, showMonitorIframe } from './dom.js';
import {
  chairClickAnimation,
  tesseractClickAnimation,
  holoscreenClickAnimation,
} from './animations.js';

/* RAYCASTER INTERACTIONS */
function performInteraction() {
  store.raycaster.setFromCamera(store.pointer, store.camera);
  const intersects = store.raycaster.intersectObjects(store.raycasterObjects);
  if (!intersects.length) return;

  const obj = intersects[0].object;

  // External contact links
  for (const [key, url] of Object.entries(store.contacts)) {
    if (obj.name.includes(key)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
  }

  // Certificate frames modal preview
  if (obj.name === "frame1_screen_raycaster") {
    showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_Network.webp");
    return;
  }
  if (obj.name === "frame2_screen_raycaster") {
    showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_CSIS.webp");
    return;
  }
  if (obj.name === "frame3_screen_raycaster") {
    showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_Security.webp");
    return;
  }

  // Desk monitor modal
  if (obj.name.includes("monitor_screen_raycaster")) {
    showMonitorIframe("/iframes/webpage/index.html");
    return;
  }

  // In-scene 3D animations
  if (obj.name.includes("chair")) {
    obj.userData.isClicked = !obj.userData.isClicked;
    chairClickAnimation(obj);
  }
  if (obj.name.includes("tesseract")) {
    obj.userData.isClicked = !obj.userData.isClicked;
    tesseractClickAnimation(obj);
  }
  if (obj.name.includes("hologram_screen")) {
    holoscreenClickAnimation(obj);
  }
}

let touchHandled = false;

window.addEventListener("touchend", event => {
  touchHandled = true;
  if (event.changedTouches && event.changedTouches.length > 0) {
    store.pointer.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    store.pointer.y = - (event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
  }
  performInteraction();
  setTimeout(() => { touchHandled = false; }, 300);
}, { passive: true });

window.addEventListener("click", () => {
  if (touchHandled) return;
  performInteraction();
});
