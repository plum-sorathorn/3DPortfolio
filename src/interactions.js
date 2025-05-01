import { store } from './store.js';
import { showIframe, showMonitorIframe } from './dom.js';
import {
  chairClickAnimation,
  tesseractClickAnimation,
  holoscreenClickAnimation,
} from './animations.js';

/* RAYCASTER INTERACTIONS */
function handleRaycasterInteraction() {
  if (store.currentIntersects.length > 0) {
    const object = store.currentIntersects[0].object;

    Object.entries(store.contacts).forEach(([key, url]) => {
      if (object.name.includes(key)) {
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location = url;
        newWindow.target   = "_blank";
        newWindow.rel      = "noopener noreferrer";
      }
    });

    if (object.name === "frame1_screen_raycaster") showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_Network.png");
    if (object.name === "frame2_screen_raycaster") showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_CSIS.png");
    if (object.name === "frame3_screen_raycaster") showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_Security.png");

    if (object.name.includes("monitor_screen_raycaster")) showMonitorIframe("/iframes/webpage/index.html");
  }
}

window.addEventListener("touchend", e => { e.preventDefault(); handleRaycasterInteraction(); }, { passive: false });
window.addEventListener("click", handleRaycasterInteraction);

store.touchObjects = false;

window.addEventListener("touchend", () => {
  store.touchObjects = true;
  const intersects = store.raycaster.intersectObjects(store.raycasterObjects);
  if (!intersects.length) return;
  const obj = intersects[0].object;
  if (obj.name.includes("chair")) {
    obj.userData.isClicked = !obj.userData.isClicked;
    chairClickAnimation(obj);
  }
  if (obj.name.includes("tesseract")) {
    obj.userData.isClicked = !obj.userData.isClicked;
    tesseractClickAnimation(obj);
  }
  if (obj.name.includes("hologram_screen")) holoscreenClickAnimation(obj);
});

window.addEventListener("click", () => {
  if (store.touchObjects){
    return;
  }
  const intersects = store.raycaster.intersectObjects(store.raycasterObjects);
  if (!intersects.length) return;
  const obj = intersects[0].object;
  if (obj.name.includes("chair")) {
    obj.userData.isClicked = !obj.userData.isClicked;
    chairClickAnimation(obj);
  }
  if (obj.name.includes("tesseract")) {
    obj.userData.isClicked = !obj.userData.isClicked;
    tesseractClickAnimation(obj);
  }
  if (obj.name.includes("hologram_screen")) holoscreenClickAnimation(obj);
});
