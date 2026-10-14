import { store } from './store.js';
import {
  contactsHoverAnimation,
  framesHoverAnimation,
  hologramHoverAnimation,
  tesseractHoverAnimation,
  chairHoverAnimation,
} from './animations.js';
import * as THREE from 'three';

/* RENDER FUNCTION TO CONTINUOSLY RENDER MODELS FOR CHANGES */

const clock = new THREE.Clock();
let currentCursor = 'default';
let rafId = null;

function setCursor(cursor) {
  if (currentCursor !== cursor) {
    document.body.style.cursor = cursor;
    currentCursor = cursor;
  }
}

function resetHovers() {
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
}

export function startRenderLoop() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  const render = () => {
    if (!store.pauseRender && !document.hidden) {
      store.controls.update();

      // Fans rotation
      for (let i = 0; i < store.fans.length; i++) {
        store.fans[i].rotation.y += 0.05;
      }

      // Tesseract pulse
      const elapsedTime = clock.getElapsedTime();
      const intensity = store.innerOriginalIntensity * (Math.sin(elapsedTime * 3) * 0.8 + 2);
      for (let i = 0; i < store.tesseracts.length; i++) {
        store.tesseracts[i].material.emissiveIntensity = intensity;
      }

      // Only perform raycasting on PC and when pointer/camera moved (dirty flag)
      if (window.innerWidth > 768) {
        if (store.raycastNeedsUpdate) {
          store.raycaster.setFromCamera(store.pointer, store.camera);
          store.currentIntersects = store.raycaster.intersectObjects(store.raycasterObjects);
          store.raycastNeedsUpdate = false;

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

              setCursor("pointer");
            } else {
              resetHovers();
              setCursor("default");
            }
          } else {
            resetHovers();
            setCursor("default");
          }
        }
      }

      store.composer.render();
      rafId = window.requestAnimationFrame(render);
    }
  };

  rafId = window.requestAnimationFrame(render);
}

// Pause/resume loop on tab visibility
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  } else if (!store.pauseRender) {
    startRenderLoop();
  }
});