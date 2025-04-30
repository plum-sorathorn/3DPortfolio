import * as THREE from 'three';
import { store } from './store.js';
import { updatePointer } from './helpers.js';

// load raycaster functions
store.currentIntersects = [];
store.raycasterObjects = [];

store.raycaster = new THREE.Raycaster();
store.pointer = new THREE.Vector2();
store.pointerNeedsUpdate = false;

// pointer update events
window.addEventListener("mousemove", event => {
  store.touchHappened = false;
  updatePointer(event.clientX, event.clientY);
});

window.addEventListener("touchstart", event => {
  event.preventDefault();
  updatePointer(event.touches[0].clientX, event.touches[0].clientY);
}, { passive: false });