import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from "gsap"

// Cache DOM elements
const modalExitButtons = document.querySelectorAll(".modal-exit-button");
const modals = document.querySelectorAll(".modal");
const iframeModal = document.querySelector(".iframe-modal");
const iframeViewer = document.getElementById("iframe-viewer");
const monitorModal = document.querySelector(".monitor-modal");
const monitorIframe = document.getElementById("monitor-iframe");

const canvas = document.querySelector("#experience-canvas")
const sizes ={
  width: window.innerWidth,
  height: window.innerHeight,
}

// Debounce resize
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Camera updating
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Renderer Updating
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, 200);
});

// to load textures
const textureLoader = new THREE.TextureLoader();

// to load 3d model
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// load raycaster functions
let currentIntersects = [];
const raycasterObjects = [];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerNeedsUpdate = false;

// hover animation variables
let currentHoveredContacts = null;
let currentHoveredFrames = null;
let currentHoveredHologram = null;

let currentHoveredTesseract = null;
let innerTesseract = null;
let outerTesseract = null;

let currentHoveredScreen = null;
let currentHoveredChair = null;


let monitorScreenObject = null;

// define links for contact
const contacts = {
  github_raycaster: "https://github.com/plum-sorathorn/",
  linkedin_raycaster: "https://www.linkedin.com/in/sorathorn-thongpitukthavorn/",
}

let touchHappened = false;
modalExitButtons.forEach(button =>{
  // Mobile device
  button.addEventListener("touchend", (event) => {
    touchHappened = true;
    const modal = event.target.closest(".modal");
    hideModal(modal);
  }, {passive: false});

  // PC or Laptop
  button.addEventListener("click", (event) => {
    if (touchHappened) return;
    const modal = event.target.closest(".modal");
    hideModal(modal);
  })
})

// functions for interaction with modals
const showModal = (modal) => {
  modal.style.display = "block"
  gsap.set(modal, {
    opacity: 0,
  })
  gsap.to(modal, {
    opacity: 1,
    duration: 0.5,

  })  
}

const hideModal = (modal) => {
  gsap.to(modal, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      modal.style.display = "none"
    }
  })
}

// helper to update pointer coords
const updatePointer = (clientX, clientY) => {
  if (!pointerNeedsUpdate) {
    pointerNeedsUpdate = true;
    requestAnimationFrame(() => {
      pointer.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.y = - (clientY / window.innerHeight) * 2 + 1;
      pointerNeedsUpdate = false;
    });
  }
};

/* START OF VARIABLE DECLARTIONS */

// create array of fans to allow for animation
const fans = [];

// create const for inner tesseract for animation
const tesseracts = [];
let innerOriginalIntensity = null;

// create const for monitor animations
const monitor = [];

/* END OF VARIABLE DECLARTIONS */

// mapping to texture files
const textureMap = {
  bigFloor: { texture: "/textures/TextureSet1_floor.webp" },
  wall: { texture: "/textures/TextureSet1_room.webp" },
  shelf: { texture: "/textures/TextureSet2_shelf.webp" },
  table: { texture: "/textures/TextureSet2_table.webp" },
  monitor_screen_raycaster: { texture: "/textures/TextureMon_Back.webp" },
  monitor: { texture: "/textures/TextureSet3_monitor.webp" },
  keyboard: { texture: "/textures/TextureSet3_keyboard.webp" },
  pc: { texture: "/textures/TextureSet4.webp" },
  fans1: {}, fans2: {}, fans3: {},
  frames: { texture: "/textures/TextureSet5.webp" },
  frame1_screen_raycaster: { texture: "/textures/TextureCer_Net.webp" },
  frame2_screen_raycaster: { texture: "/textures/TextureCer_CSIS.webp" },
  frame3_screen_raycaster: { texture: "/textures/TextureCer_Sec.webp" },
  drawers: { texture: "/textures/TextureSet6.webp" },
  chair_top_raycaster: { texture: "/textures/TextureSet7.webp" },
  chair_bottom: { texture: "/textures/TextureSet7.webp" },
  github_raycaster: { texture: "/textures/TextureSet8_github.webp" },
  linkedin_raycaster: { texture: "/textures/TextureSet8_linkedin.webp" },
  hologramBase: { texture: "/textures/TextureSet2_holo_base.webp" },
  hologram_screen_raycaster: {},
  hologram_ball: {},
  hologram_cone: {},
  pc_glass: {},
  tesseract_inner_raycaster: {},
  tesseract_outer_raycaster: {},
};

/* LOADING OF VIDEO TEXTURES */

// load in video for hologram screen
const holoVideo = document.createElement("video");
holoVideo.src = "/textures/videos/holoscreen2.mp4";
holoVideo.loop = true;
holoVideo.muted = true;
holoVideo.autoplay = true;
const playHoloVideo = () => {
  holoVideo.play().catch(error => console.error("Error playing holo video:", error));
};
setTimeout(playHoloVideo, 500);

document.addEventListener("visibilitychange", handleVisibilityChange);
function handleVisibilityChange() {
  if (document.hidden) holoVideo.pause();
  else holoVideo.play().catch(error => console.error("Holo Autoplay prevented:", error));
}

const holoVideoTexture = new THREE.VideoTexture(holoVideo);
holoVideoTexture.colorSpace = THREE.SRGBColorSpace;

/* END OF LOADING OF VIDEO TEXTURES */

/* RAYCASTER INTERACTIONS */
// pointer update events
window.addEventListener("mousemove", event => {
  touchHappened = false;
  updatePointer(event.clientX, event.clientY);
});
window.addEventListener("touchstart", event => {
  event.preventDefault();
  updatePointer(event.touches[0].clientX, event.touches[0].clientY);
}, { passive: false });

function handleRaycasterInteraction() {
  if (currentIntersects.length > 0) {
    const object = currentIntersects[0].object;

    Object.entries(contacts).forEach(([key, url]) => {
      if (object.name.includes(key)) {
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location = url;
        newWindow.target = "_blank";
        newWindow.rel = "noopener noreferrer";
      }
    });

    if (object.name == "frame1_screen_raycaster") showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_Network.png");
    if (object.name == "frame2_screen_raycaster") showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_CSIS.png");
    if (object.name == "frame3_screen_raycaster") showIframe("/iframes/iframe-viewer.html?img=/images/CompTIA_Security.png");

    if (object.name.includes("monitor_screen_raycaster")) showMonitorIframe("/iframes/webpage/index.html");
  }
}

modalExitButtons.forEach(button => button); // ensure modalExitButtons used after

// reuse showModal/hideModal from above
function showIframe(src) {
  iframeViewer.src = src;
  showModal(iframeModal);
}
function showMonitorIframe(src) {
  monitorIframe.src = src;
  showModal(monitorModal);
}

modals.forEach(modal => {
  if (!touchHappened) modal.addEventListener('click', e => e.target === modal && hideModal(modal));
  modal.addEventListener('touchend', e => e.target === modal && hideModal(modal), { passive: false });
});

window.addEventListener("touchend", event => { event.preventDefault(); handleRaycasterInteraction(); }, { passive: false });
window.addEventListener("click", handleRaycasterInteraction);

window.addEventListener("click", event => {
  const intersects = raycaster.intersectObjects(raycasterObjects);
  if (!intersects.length) return;
  const obj = intersects[0].object;
  if (obj.name.includes("chair")) {
    obj.userData.isClicked = !obj.userData.isClicked;
    chairClickAnimation(obj, obj.userData.isClicked);
  }
  if (obj.name.includes("tesseract")) {
    obj.userData.isClicked = !obj.userData.isClicked;
    tesseractClickAnimation(obj);
  }
  if (obj.name.includes("hologram_screen")) holoscreenClickAnimation(obj);
});

/* END OF RAYCASTER INTERACTIONS */

/* SETTING UP SCENE, CAMERA, AND LIGHTING */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.1, 1);
composer.addPass(unrealBloomPass);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = Math.PI / 2.25;
controls.maxAzimuthAngle = -Math.PI / 1;
controls.minDistance = 5;
controls.maxDistance = 40;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

// set starting postion and camera angle
camera.position.set(10, 15, -10);
controls.target.set(0, 10, 0);

/* END OF SETTING UP SCENE, CAMERA, AND LIGHTING */

// precalc texture keys
const textureKeys = Object.keys(textureMap);
// load textures onto models
const loadedTextures = { texture: {} };
for (const key of textureKeys) {
  const path = textureMap[key].texture;
  if (path) {
    const currentTexture = textureLoader.load(path);
    currentTexture.flipY = false;
    currentTexture.colorSpace = THREE.SRGBColorSpace;
    loadedTextures.texture[key] = currentTexture;

  }
}

/* START OF DEFAULT ANIMATION FUNCTIONS */

// Default pulsing animation for the monitor screen
function startMonitorPulse(object) {
  if (object && object.material.color && !object.userData.isHovered) {
      gsap.killTweensOf(object.material.color);

      if (!object.userData.pulseTween || !object.userData.pulseTween.isActive()) {
           object.userData.pulseTween = gsap.to(object.material.color, {
               r: object.material.color.r * 1.9,
               g: object.material.color.g * 1.9,
               b: object.material.color.b * 1.9,
               duration: 0.7,
               ease: "sine.inOut",
               yoyo: true,
               repeat: -1,
           });
      } else {
           object.userData.pulseTween.resume();
      }
  }
}
/* END OF DEFAULT ANIMATION FUNCTIONS */

/* MAIN FUNCTION TO LOAD MODEL AND ADJUST TEXTURES */
loader.load("/models/room_test-v1.glb", glb => {
  glb.scene.traverse(child => {
    if (!child.isMesh) return;
    
    for (const key of textureKeys) {
      if (!child.name.includes(key)) continue;

      let material;
      if (child.name.includes("glass")) {
        material = new THREE.MeshPhysicalMaterial({
          color: 0xe1e1e1,
          transmission: 1,
          opacity: 0.5,
          metalness: 0,
          roughness: 0,
          ior: 1.0,
          thickness: 0.01,
          specularIntensity: 1,
          envMapIntensity: 1,
          lightMapIntensity: 1,
          transparent: true,
          depthWrite: false,
        });
      } else if (child.name.includes("fans")) {
        material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        child.rotation.x = -Math.PI / 2;
        child.rotation.z = -10 * (Math.PI / 180);
        child.position.z += 0.1;
        fans.push(child);
      } else if (child.name == "tesseract_inner_raycaster") {
        material = new THREE.MeshPhysicalMaterial({
          transmission: 0.9,
          opacity: 0.6,
          roughness: 0.05,
          metalness: 0,
          ior: 1.5,
          emissive: 0x0c1faff,
          emissiveIntensity: 1.5,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        innerOriginalIntensity = material.emissiveIntensity;
        innerTesseract = child;
        tesseracts.push(child);
      } else if (child.name == "tesseract_outer_raycaster") {
        material = new THREE.MeshPhysicalMaterial({
          emissive: 0x0c1faff,
          opacity: 0.3,
          metalness: 0,
          roughness: 0.1,
          transparent: true,
          depthWrite: false,
          blendEquation: THREE.AdditiveBlending,
        });
        outerTesseract = child;
      } else if (child.name.includes("hologram_ball") || child.name.includes("hologram_cone")) {
        const emissiveColor = child.name.includes("hologram_ball") ? 0x0c1faff : 0x003335;
        material = new THREE.MeshPhysicalMaterial({
          transmission: 0.9,
          opacity: child.name.includes("hologram_ball") ? 0.6 : 0.5,
          roughness: 0.05,
          metalness: 0,
          ior: 1.5,
          emissive: emissiveColor,
          emissiveIntensity: 0.7,
          side: THREE.DoubleSide,
          depthWrite: false
        });
      } else if (child.name.includes("hologram_screen")) {
        material = new THREE.MeshBasicMaterial({
          opacity: 0.5,
          transparent: true,
          depthWrite: false,
          map: holoVideoTexture,
          side: THREE.DoubleSide,
        });
        material.color.setHex(0x00bd99).multiplyScalar(5);
      } else {
        material = new THREE.MeshBasicMaterial({ map: loadedTextures.texture[key] });
        if (material.map) material.map.minFilter = THREE.LinearFilter;
      }

      child.material = material;

      if (child.name.includes("_raycaster")) {
        raycasterObjects.push(child);
        child.userData.initialScale = child.scale.clone();
        child.userData.initialPosition = child.position.clone();
        child.userData.initialRotation = child.rotation.clone();
        child.userData.isAnimating = false;
        child.userData.isClicked = false;
      }

      if (child.name.includes("monitor_screen_raycaster")) {
        monitorScreenObject = child;
    }

      break;
    }
  });
  scene.add(glb.scene);

  if (monitorScreenObject) {
    startMonitorPulse(monitorScreenObject);
  }
});

/* END OF MAIN FUNCTION TO LOAD MODEL AND ADJUST TEXTURES */

/* START OF MOUSE HOVERING ANIMATIONS */

// mouse-hovering animation for contacts
function contactsHoverAnimation(object, isHovering){
  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.rotation);
  gsap.killTweensOf(object.position);
  
  if(isHovering){
    gsap.to(object.scale, {
      x: object.userData.initialScale.x * 1.2,
      y: object.userData.initialScale.y * 1.2,
      z: object.userData.initialScale.z * 1.2,
      duration: 0.5,
      ease: "bounce.out(1.8)",
    });
    gsap.to(object.rotation, {
      y: object.userData.initialRotation.y * 1.2 + -Math.PI / 6,
      duration: 0.5,
      ease: "bounce.out(1.8)",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    })
  } else {
    gsap.to(object.scale, {
      x: object.userData.initialScale.x,
      y: object.userData.initialScale.y,
      z: object.userData.initialScale.z,
      duration: 0.3,
      ease: "bounce.out(1.8)",
    });
    gsap.to(object.rotation, {
      y: object.userData.initialRotation.y,
      duration: 0.5,
      ease: "bounce.out(1.8)",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    })
  }
}

// mouse-hovering animation for frames
function framesHoverAnimation(object, isHovering) {
  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.position);

  if (isHovering) {
    gsap.to(object.scale, {
      x: object.userData.initialScale.x * 1.3,
      y: object.userData.initialScale.y * 1.3,
      z: object.userData.initialScale.z * 1.3,
      duration: 0.3,
      ease: "expo.inOut(1.8)",
    });

    gsap.to(object.position, {
      x: object.userData.initialPosition.x / 1.05,
      duration: 0.3,
      ease: "expo.inOut(1.8)",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    });
  } else {
    gsap.to(object.scale, {
      x: object.userData.initialScale.x,
      y: object.userData.initialScale.y,
      z: object.userData.initialScale.z,
      duration: 0.3,
      ease: "expo.inOut",
    });

    gsap.to(object.position, {
      x: object.userData.initialPosition.x,
      duration: 0.5,
      ease: "expo.inOut",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    });
  }
}

// mouse-hovering animation for hologram
function hologramHoverAnimation(object, isHovering) {
  gsap.killTweensOf(object.material.color);
  gsap.killTweensOf(holoVideo);

  if (isHovering) {
    gsap.to(object.material.color, {
      color: object.material.color.multiplyScalar(1.5),
    });
    gsap.to(holoVideo, {
      playbackRate: 5,
      duration: 0.5,
      ease: "power2",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    });
  } else {
    gsap.to(object.material.color, {
      color: object.material.color.multiplyScalar((2/3)),
    });
    gsap.to(holoVideo, {
      playbackRate: 1,
      duration: 0.5,
      ease: "power2",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    });
  }
}

// mouse-hovering animation for tesseract
function tesseractHoverAnimation(object, isHovering) {
  if (object.userData.isClicked) return;

  // rest of your existing hover logic…
  const targets = [ object ];
  if (object === outerTesseract && innerTesseract) {
    targets.push(innerTesseract);
  }

  targets.forEach(t => {
    gsap.killTweensOf(t.scale);
    gsap.killTweensOf(t.rotation);
  });

  if (isHovering) {
    // scale up + spin once
    targets.forEach(target => {
      gsap.to(target.scale, {
        x: target.userData.initialScale.x * 1.2,
        y: target.userData.initialScale.y * 1.2,
        z: target.userData.initialScale.z * 1.2,
        duration: 0.3,
        ease: "expo.inOut"
      });
      gsap.to(target.rotation, {
        y: target.userData.initialRotation.y + Math.PI * 2,
        duration: 1,
        ease: "none"
      });
    });
  } else {
    // reset to initial
    targets.forEach(target => {
      gsap.to(target.scale, {
        x: target.userData.initialScale.x,
        y: target.userData.initialScale.y,
        z: target.userData.initialScale.z,
        duration: 0.3,
        ease: "expo.inOut"
      });
      gsap.to(target.rotation, {
        x: target.userData.initialRotation.x,
        y: target.userData.initialRotation.y,
        z: target.userData.initialRotation.z,
        duration: 0.5,
        ease: "expo.inOut"
      });
    });
  }
}


// mouse-hovering animation for monitor screen
function screenHoverAnimation(object, isHovering) {
//   object.userData.isHovered = isHovering; // Update hover state
//   gsap.killTweensOf(object.material.color);
  
//   if (isHovering) {
//   // Stop the default pulsing animation
//   stopMonitorPulse(object);
//     // Start the glow tween - stay bright as long as hovered
//   gsap.to(object.material.color, {
//     r: object.material.color.r * 1.7,
//     g: object.material.color.g * 1.7,
//     b: object.material.color.b * 1.7,
//     duration: 0.3, // Quick transition to glow
//     ease: "power1.out",
//    });
//   } else {
//     // Tween color back to the base color after hover ends
//     gsap.to(object.material.color, {
//       r: object.material.color.r * (10/17),
//       g: object.material.color.g * (10/17),
//       b: object.material.color.b * (10/17),
//       duration: 0.5, // Fade out glow
//       ease: "power1.in",
//       onComplete: () => {
//         // Resume the default pulsing animation after the fade out
//         startMonitorPulse(object);
//       }
//     });
//    }
  }

// mouse hovering animation for chair
function chairHoverAnimation(object, isHovering) {
  gsap.killTweensOf(object.rotation);

  if (isHovering) {
    object.userData.isAnimating = true;
    object.userData.isClicked   = true;

    gsap.to(object.rotation, {
      y: object.userData.initialRotation.y * 1 + Math.PI / 8,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(object.rotation, {
          y: object.userData.initialRotation.y,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            object.userData.isAnimating = false;
            object.userData.isClicked   = false;
          }
        });
      }
    });
  } else {
    // reset on hover‐out
    gsap.to(object.rotation, {
      x: object.userData.initialRotation.x,
      y: object.userData.initialRotation.y,
      z: object.userData.initialRotation.z,
      duration: 0.3,
      ease: "power1.out",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    });
  }
}

/* END OF MOUSE HOVERING ANIMATIONS */

/* START OF MOUSE CLICK ANIMATIONS */

// animation for chair click
function chairClickAnimation(object) {
  gsap.killTweensOf(object.rotation);

  gsap.to(object.rotation, {
    y: object.userData.initialRotation.y * 1.2 + Math.PI / 6,
    duration: 1.5,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    onComplete: () => {
      object.userData.isAnimating = false;
    }
  });
}


// animation for tesseract click
function tesseractClickAnimation(object) {
  const targets = [ object ];
  if (object === outerTesseract && innerTesseract) {
    targets.push(innerTesseract);
  }

  targets.forEach(t => {
    gsap.killTweensOf(t.rotation);
    gsap.killTweensOf(t.scale);
  });

  if (object.userData.isClicked) {
    targets.forEach(target => {
      gsap.to(target.scale, {
        x: target.userData.initialScale.x * 1.2,
        y: target.userData.initialScale.y * 1.2,
        z: target.userData.initialScale.z * 1.2,
        duration: 0.3,
        ease: "expo.inOut"
      });
      gsap.to(target.rotation, {
        y: "+= 5",
        duration: 2,
        ease: "none",
        repeat: -1
      });
    });
  } else {
    targets.forEach(target => {
      gsap.to(target.scale, {
        x: target.userData.initialScale.x,
        y: target.userData.initialScale.y,
        z: target.userData.initialScale.z,
        duration: 0.3,
        ease: "expo.inOut"
      });
      gsap.to(target.rotation, {
        x: target.userData.initialRotation.x,
        y: target.userData.initialRotation.y,
        z: target.userData.initialRotation.z,
        duration: 0.5,
        ease: "expo.inOut"
      });
    });
  }
}


function holoscreenClickAnimation(object) {
}

/* END OF MOUSE CLICK ANIMATIONS */

/* RENDER FUNCTION TO CONTINUOSLY RENDER MODELS FOR CHANGES */
let time = 0;
const render = () => {
  controls.update();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  fans.forEach(fan => fan.rotation.y += 0.05);

  time += 0.008;
  tesseracts.forEach(tess => tess.material.emissiveIntensity = innerOriginalIntensity * (Math.sin(time * 2) * 0.5 + 1));

  raycaster.setFromCamera(pointer, camera);
  currentIntersects = raycaster.intersectObjects(raycasterObjects);

  // Animation logic for raycaster objects
  if (currentIntersects.length > 0){
    const currentIntersectObject = currentIntersects[0].object;

    if (currentIntersectObject.name.includes("_raycaster")) {
      // Animations for contacts
      if (currentIntersectObject.name.includes("github") || currentIntersectObject.name.includes("linkedin")){
        if (currentIntersectObject != currentHoveredContacts) {
          if (currentHoveredContacts){
            contactsHoverAnimation(currentHoveredContacts, false);
          }
          contactsHoverAnimation(currentIntersectObject, true);
          currentHoveredContacts = currentIntersectObject;
        }
      }
      // Animations for frames
      if (currentIntersectObject.name.includes("frame") && currentIntersectObject.name.includes("_screen")){
        if (currentIntersectObject != currentHoveredFrames) {
          if (currentHoveredFrames){
            framesHoverAnimation(currentHoveredFrames, false);
          }
          framesHoverAnimation(currentIntersectObject, true);
          currentHoveredFrames = currentIntersectObject;
        }
      }

      // Animation for hologram
      if (currentIntersectObject.name.includes("hologram_screen")) {
        if (currentIntersectObject !== currentHoveredHologram) {
          if (currentHoveredHologram)
            hologramHoverAnimation(currentHoveredHologram, false);
          hologramHoverAnimation(currentIntersectObject, true);
          currentHoveredHologram = currentIntersectObject;
        }
      }

      // Animation for tesseract
      if (currentIntersectObject.name.includes("tesseract")) {
        if (currentIntersectObject !== currentHoveredTesseract) {
          if (currentHoveredTesseract)
            tesseractHoverAnimation(currentHoveredTesseract, false);
          tesseractHoverAnimation(currentIntersectObject, true);
          currentHoveredTesseract = currentIntersectObject;
        }
      }

      // Animation for screen (monitor)
      if (currentIntersectObject.name.includes("monitor_screen")) {
        if (currentIntersectObject !== currentHoveredScreen) {
          if (currentHoveredScreen)
            screenHoverAnimation(currentHoveredScreen, false);
          screenHoverAnimation(currentIntersectObject, true);
          currentHoveredScreen = currentIntersectObject;
        }
      }

      // Animation for chair
      if (
        currentIntersectObject.name.includes("chair") &&
        !currentIntersectObject.userData.isClicked &&
        !currentIntersectObject.userData.isAnimating
      ) {
        if (currentIntersectObject !== currentHoveredChair) {
          if (
            currentHoveredChair &&
            !currentHoveredChair.userData.isClicked
          ) {
            chairHoverAnimation(currentHoveredChair, false);
          }
          chairHoverAnimation(currentIntersectObject, true);
          currentHoveredChair = currentIntersectObject;
        }
      }

      

      document.body.style.cursor = "pointer"
    } else {
      document.body.style.cursor = "default"
    }
  }
  else {
    // Animations for contacts
    if (currentHoveredContacts){
      contactsHoverAnimation(currentHoveredContacts, false);
      currentHoveredContacts = null;
    }
    // Animations for frames
    if (currentHoveredFrames){
      framesHoverAnimation(currentHoveredFrames, false);
      currentHoveredFrames = null;
    }

    // Animations for hologram
    if (currentHoveredHologram) {
      hologramHoverAnimation(currentHoveredHologram, false);
      currentHoveredHologram = null;
    }

    // Animations for tessearact
    if (currentHoveredTesseract){
      tesseractHoverAnimation(currentHoveredTesseract, false);
      currentHoveredTesseract = null;
    }
    // Animations for screen (monitor)
    if (currentHoveredScreen){
      screenHoverAnimation(currentHoveredScreen, false);
      currentHoveredScreen = null;
    }

    // Animations for chair
    if (currentHoveredChair && !currentHoveredChair.userData.isClicked) {
      chairHoverAnimation(currentHoveredChair, false);
      currentHoveredChair = null;
    }

    document.body.style.cursor = "default"
  }


  composer.render();

  window.requestAnimationFrame(render);
}

render()

/* END OF RENDER FUNCTION TO CONTINUOSLY RENDER MODELS FOR CHANGES */