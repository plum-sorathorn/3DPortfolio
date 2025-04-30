import * as THREE from 'three';
import gsap from 'gsap';
import { store } from './store.js';
import { startIntroAnimation } from './introAnimations.js';

// Cache DOM elements
store.modalExitButtons = document.querySelectorAll(".modal-exit-button");
store.modals = document.querySelectorAll(".modal");
store.iframeModal = document.querySelector(".iframe-modal");
store.iframeViewer = document.getElementById("iframe-viewer");
store.monitorModal = document.querySelector(".monitor-modal");
store.monitorIframe = document.getElementById("monitor-iframe");

// loading screen elements
store.manager = new THREE.LoadingManager();
store.loadingScreen = document.querySelector('.loading-screen');
store.loadingScreenButton = document.querySelector('.loading-screen-button');

store.manager.onLoad = function () {
  const { loadingScreen, loadingScreenButton } = store;

  // Style the button to indicate it's ready
  loadingScreen.style.opacity = "0.90";  
  loadingScreen.style.transition = "opacity 0.7s ease-in-out";
  loadingScreenButton.textContent = "Enter";
  loadingScreenButton.style.border = "2px solid #00ffcc";
  loadingScreenButton.style.cursor = "pointer";
  loadingScreenButton.style.opacity = "0.90";  
  loadingScreenButton.style.transition = "all 0.7s ease-in-out";

  let isDisabled = false;

  function handleEnter() {
    if (isDisabled) return;
    isDisabled = true;

    // Update button style for interaction
    loadingScreenButton.style.border = "2px solid #ffffff";

    // Animate away loading screen
    playReveal();
  }

  function playReveal() {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: () => {
        startIntroAnimation();
      }
    });
  }

  // Event listeners
  loadingScreenButton.addEventListener("click", handleEnter);
  loadingScreenButton.addEventListener("touchend", e => {
    e.preventDefault();
    handleEnter();
  }, { passive: false });
  loadingScreenButton.addEventListener("mouseenter", () => {
    loadingScreenButton.style.borderColor = "#ffffff";
  });
};

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
    if (store.touchHappened) return;
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
