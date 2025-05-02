import { store } from './store.js';
import {
  contactsHoverAnimation,
  framesHoverAnimation,
  hologramHoverAnimation,
  tesseractHoverAnimation,
  chairHoverAnimation,
} from './animations.js';

/* RENDER FUNCTION TO CONTINUOSLY RENDER MODELS FOR CHANGES */
let time = 0;
export function startRenderLoop() {
  const render = () => {
    store.controls.update();

    store.fans.forEach(fan => fan.rotation.y += 0.05);

    time += 0.008;
    store.tesseracts.forEach(tess => {
      tess.material.emissiveIntensity = store.innerOriginalIntensity * (Math.sin(time * 10) * 0.8 + 2);
    });

    store.raycaster.setFromCamera(store.pointer, store.camera);
    store.currentIntersects = store.raycaster.intersectObjects(store.raycasterObjects);

    // only allow hovers if on PC
    if (window.innerWidth > 768) {
      if (store.currentIntersects.length > 0) {
        const currentIntersectObject = store.currentIntersects[0].object;

        if (currentIntersectObject.name.includes("_raycaster")) {
          // contacts hover
          if (currentIntersectObject.name.includes("github") || currentIntersectObject.name.includes("linkedin")) {
            if (currentIntersectObject !== store.currentHoveredContacts) {
              if (store.currentHoveredContacts) contactsHoverAnimation(store.currentHoveredContacts, false);
              contactsHoverAnimation(currentIntersectObject, true);
              store.currentHoveredContacts = currentIntersectObject;
            }
          }
          // frames hover
          if (currentIntersectObject.name.includes("frame") && currentIntersectObject.name.includes("_screen")) {
            if (currentIntersectObject !== store.currentHoveredFrames) {
              if (store.currentHoveredFrames) framesHoverAnimation(store.currentHoveredFrames, false);
              framesHoverAnimation(currentIntersectObject, true);
              store.currentHoveredFrames = currentIntersectObject;
            }
          }
          // hologram hover
          if (currentIntersectObject.name.includes("hologram_screen")) {
            if (currentIntersectObject !== store.currentHoveredHologram) {
              if (store.currentHoveredHologram) hologramHoverAnimation(store.currentHoveredHologram, false);
              hologramHoverAnimation(currentIntersectObject, true);
              store.currentHoveredHologram = currentIntersectObject;
            }
          }
          // tesseract hover
          if (currentIntersectObject.name.includes("tesseract")) {
            if (currentIntersectObject !== store.currentHoveredTesseract) {
              if (store.currentHoveredTesseract) tesseractHoverAnimation(store.currentHoveredTesseract, false);
              tesseractHoverAnimation(currentIntersectObject, true);
              store.currentHoveredTesseract = currentIntersectObject;
            }
          }
          // chair hover
          if (currentIntersectObject.name.includes("chair") &&
              !currentIntersectObject.userData.isClicked &&
              !currentIntersectObject.userData.isAnimating) {
            if (currentIntersectObject !== store.currentHoveredChair) {
              if (store.currentHoveredChair && !store.currentHoveredChair.userData.isClicked) {
                chairHoverAnimation(store.currentHoveredChair, false);
              }
              chairHoverAnimation(currentIntersectObject, true);
              store.currentHoveredChair = currentIntersectObject;
            }
          }

          document.body.style.cursor = "pointer";
        } else {
          document.body.style.cursor = "default";
        }
      } else {
        // Reset any lingering hover animations
        if (store.currentHoveredContacts) {
          contactsHoverAnimation(store.currentHoveredContacts, false);
          store.currentHoveredContacts = null;
        }
        if (store.currentHoveredFrames) {
          framesHoverAnimation(store.currentHoveredFrames, false);
          store.currentHoveredFrames = null;
        }
        if (store.currentHoveredHologram) {
          hologramHoverAnimation(store.currentHoveredHologram, false);
          store.currentHoveredHologram = null;
        }
        if (store.currentHoveredTesseract) {
          tesseractHoverAnimation(store.currentHoveredTesseract, false);
          store.currentHoveredTesseract = null;
        }
        if (store.currentHoveredChair && !store.currentHoveredChair.userData.isClicked) {
          chairHoverAnimation(store.currentHoveredChair, false);
          store.currentHoveredChair = null;
        }

        document.body.style.cursor = "default";
      }
    }

    store.composer.render();
    window.requestAnimationFrame(render);
  };

  render();
}