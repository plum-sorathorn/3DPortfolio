import gsap from 'gsap';
import { store } from './store.js';

// Cache DOM elements
store.modalExitButtons = document.querySelectorAll(".modal-exit-button");
store.modals = document.querySelectorAll(".modal");
store.iframeModal = document.querySelector(".iframe-modal");
store.iframeViewer = document.getElementById("iframe-viewer");
store.monitorModal = document.querySelector(".monitor-modal");
store.monitorIframe = document.getElementById("monitor-iframe");

store.touchHappened = false;

// Functions for interaction with modals
store.showModal = modal => {
  modal.style.display = "block";
  gsap.set(modal, { opacity: 0 });
  gsap.to(modal, { opacity: 1, duration: 0.5 });
};

store.hideModal = modal => {
  gsap.to(modal, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => { modal.style.display = "none"; }
  });
};

// Exit buttons - phones and PCs
store.modalExitButtons.forEach(button => {
  // Mobile devices
  button.addEventListener("touchend", event => {
    store.touchHappened = true;
    const modal = event.target.closest(".modal");
    store.hideModal(modal);
  }, { passive: false });

  // Desktop
  button.addEventListener("click", event => {
    if (store.touchHappened) return; // ignore ghost click after touch
    const modal = event.target.closest(".modal");
    store.hideModal(modal);
  });
});

// Helper wrappers the raycaster uses
export const showIframe = src => {
  store.iframeViewer.src = src;
  store.showModal(store.iframeModal);
};

export const showMonitorIframe = src => {
  store.monitorIframe.src = src;
  store.showModal(store.monitorModal);
};

// Hide modal on backdrop press
store.modals.forEach(modal => {
  modal.addEventListener('click', e => e.target === modal && store.hideModal(modal));
  modal.addEventListener('touchend', e => e.target === modal && store.hideModal(modal), { passive: false });
});
