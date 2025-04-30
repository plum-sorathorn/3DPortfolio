import { store } from './store.js';

// Helper to update pointer coordinates (debounced via a flag)
export const updatePointer = (clientX, clientY) => {
  if (!store.pointerNeedsUpdate) {
    store.pointerNeedsUpdate = true;
    requestAnimationFrame(() => {
      store.pointer.x = (clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = - (clientY / window.innerHeight) * 2 + 1;
      store.pointerNeedsUpdate = false;
    });
  }
};
