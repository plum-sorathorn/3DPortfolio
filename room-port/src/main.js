import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from "gsap"

const canvas = document.querySelector("#experience-canvas")
const sizes ={
  width: window.innerWidth,
  height: window.innerHeight,
}

/* START OF VARIABLE DECLARTIONS */

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

// hover animation variables
let currentHoveredContacts = null;
let currentHoveredFrames = null;
let currentHoveredHologram = null;

let currentHoveredTesseract = null;
let innerTesseract = null;
let outerTesseract = null;

let currentHoveredScreen = null;
let currentHoveredChair = null;

// define links for contact
const contacts = {
  github_raycaster: "https://github.com/plum-sorathorn/",
  linkedin_raycaster: "https://www.linkedin.com/in/sorathorn-thongpitukthavorn/",
}

// define links for certs (frames)
const certs = {
  frame1_screen_raycaster: "",
  frame2_screen_raycaster: "",
  frame3_screen_raycaster: "",
}

// define modals for GSAP animations
const modals = {
  about: document.querySelector(".modal.about"),
  cerA:  document.querySelector(".modal.cerA"),
  cerCSIS:  document.querySelector(".modal.cerCSIS"),
  cerNet:  document.querySelector(".modal.cerNet"),
}

let touchHappened = false;
document.querySelectorAll(".modal-exit-button").forEach(button =>{
  // Mobile device
  button.addEventListener("touchend", (event) => {
    touchHappened = true;
    const modal = event.target.closest(".modal");
    hideModal(modal);
  }, 
  {passive: false,}
  );

  // PC or Laptop
  button.addEventListener("click", (event) => {
    if (touchHappened) {return;}
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
    onComplelte: () => {
      modal.style.display = "none"
    }
  })
}


// create array of fans to allow for animation
const fans = [];

// create const for inner tesseract for animation
const tesseracts = []
let innerOriginalIntensity = null;

// create const for chair for animation
const chairs = []

/* END OF VARIABLE DECLARTIONS */


// mapping to texture files
const textureMap = {
  bigFloor: {
    texture: "/textures/TextureSet1_floor.webp",
  },
  wall: {
    texture: "/textures/TextureSet1_room.webp",
  },
  hologramBase: {
    texture: "/textures/TextureSet2_holo_base.webp",
  },
  shelf: {
    texture: "/textures/TextureSet2_shelf.webp",
  },
  table: {
    texture: "/textures/TextureSet2_table.webp",
  },
  keyboard: {
    texture: "/textures/TextureSet3_keyboard.webp",
  },
  monitor: {
    texture: "/textures/TextureSet3_monitor.webp",
  },
  pc: {
    texture: "/textures/TextureSet4.webp",
  },
  frames: {
    texture: "/textures/TextureSet5.webp",
  },
  drawers: {
    texture: "/textures/TextureSet6.webp",
  },
  chair_top_raycaster: {
    texture: "/textures/TextureSet7.webp",
  },
  chair_bottom: {
    texture: "/textures/TextureSet7.webp",
  },
  github_raycaster: {
    texture: "/textures/TextureSet8_github.webp"
  },
  linkedin_raycaster: {
    texture: "/textures/TextureSet8_linkedin.webp"
  },
  fans1: {}, fans2: {}, fans3: {},
  frame1_screen_raycaster: {
    texture: "/images/CompTIA_Network.png" 
  }, 
  frame2_screen_raycaster: { 
    texture: "/images/CompTIA_CSIS.png"
  }, 
  frame3_screen_raycaster: {
    texture: "/images/CompTIA_Security.png"
  },
  monitor_screen_raycaster: {
    texture: "/images/monitor_background.jpg"
  },
  hologram_screen_raycaster: {},
  hologram_ball: {},
  hologram_cone: {},
  pc_glass: {},
  tesseract_inner_raycaster: {},
  tesseract_outer_raycaster: {},
};

// load textures onto models
const loadedTextures = {
  texture: {},
}

Object.entries(textureMap).forEach(([key, paths])=>{
  const currentTexture = textureLoader.load(paths.texture);
  currentTexture.flipY = false;
  currentTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.texture[key] = currentTexture;
});

/* LOADING OF VIDEO TEXTURES */

// load in video for hologram screen
const holoVideo = document.createElement("video");
holoVideo.src = "/textures/videos/holoscreen2.mp4";
holoVideo.loop = true;
holoVideo.muted = true;
holoVideo.autoplay = true;
const playHoloVideo = () => {
  holoVideo.play().catch(error => {
      console.error("Error playing holo video:", error);
  });
};
setTimeout(playHoloVideo, 500);

// Add event listener for visibility change
document.addEventListener("visibilitychange", handleVisibilityChange);
// Function to handle video playback based on tabs
function handleVisibilityChange() {
  if (document.hidden) {
    holoVideo.pause();
  } else {
    holoVideo.play().catch(error => {
      console.error("Holo Autoplay prevented:", error);
    });
  }
}

const holoVideoTexture = new THREE.VideoTexture(holoVideo);
holoVideoTexture.colorSpace = THREE.SRGBColorSpace;

/* END OF LOADING OF VIDEO TEXTURES */

/* RAYCASTER INTERACTIONS */
// function for raycaster (triggers for mouse hovers)
window.addEventListener("mousemove", (event)=> {
  touchHappened = false;
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
})

window.addEventListener("touchstart", (event)=> {
  event.preventDefault();
  pointer.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
  },
  {passive: false,}
)

function handleRaycasterInteraction() {
  if(currentIntersects.length > 0){
    const object = currentIntersects[0].object;

    Object.entries(contacts).forEach(([key, url]) => {
      if(object.name.includes(key)) {
        const newWindow = window.open();
        newWindow.opener = null;
        newWindow.location = url;
        newWindow.target = "_blank";
        newWindow.rel = "noopener noreferrer";
      }
    });

    if (object.name == "monitor_screen_raycaster") {
      showModal(modals.about)
    }
    if (object.name == "frame1_screen_raycaster") {
      showModal(modals.cerA)
    }
    if (object.name == "frame2_screen_raycaster") {
      showModal(modals.cerCSIS)
    }
    if (object.name == "frame3_screen_raycaster") {
      showModal(modals.cerNet)
    }
    
  }
}

window.addEventListener("touchend", (event)=> {
  event.preventDefault();
  handleRaycasterInteraction();
}, {passive: false}
);



// function for mouse-interactions
window.addEventListener("click", handleRaycasterInteraction);

/* END OF RAYCASTER INTERACTIONS */

/* MAIN FUNCTION TO LOAD MODEL AND ADJUST TEXTURES */

// main function to load and adjust each object in the 3d model
loader.load("/models/room_test-v1.glb", (glb)=> {
  glb.scene.traverse(child =>{
    if (child.isMesh){
      Object.keys(textureMap).forEach(key=>{
        if(child.name.includes(key)){
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.texture[key]
          });

          child.material = material;
          
          if(child.material.map){
            child.material.map.minFilter = THREE.LinearFilter;
          }

          // add them objects for mouse interactions (raycaster)
          if (child.name.includes("_raycaster")) {
            raycasterObjects.push(child);
            child.userData.initialScale = new THREE.Vector3().copy(child.scale);
            child.userData.initialPosition = new THREE.Vector3().copy(child.position);
            child.userData.initialRotation = new THREE.Euler().copy(child.rotation);
            child.userData.isAnimating = false;
          }

          // texture for PC glass
          if(child.name.includes("glass")){
            child.material = new THREE.MeshPhysicalMaterial({
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
          } 
          // add color to fans
          if(child.name.includes( "fans" )){
            child.material = new THREE.MeshBasicMaterial({ 
              color: 0xffffff,
            });
            child.rotation.x = -Math.PI / 2;
            child.rotation.z = -10 * (Math.PI / 180);
            child.position.z += 0.1;
            fans.push(child);
          }
          // monitor screen adjustments
          if(child.name == "monitor"){
            child.material.color.multiplyScalar(0.5);
          }
          // monitor screen adjustments
          if(child.name == "monitor_screen_raycaster"){
            child.material.color.multiplyScalar(0.7);
          }
          // textures for tesseract
          if(child.name == "tesseract_inner_raycaster"){
            child.material = new THREE.MeshPhysicalMaterial({
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
            innerOriginalIntensity = child.material.emissiveIntensity;
            innerTesseract = child;
            tesseracts.push(child)
          }
          if(child.name == "tesseract_outer_raycaster"){
            child.material = new THREE.MeshPhysicalMaterial({
              emissive: 0x0c1faff,
              opacity: 0.3,
              metalness: 0,
              roughness: 0.1,
              transparent: true,
              depthWrite: false,
              blendEquation: THREE.AdditiveBlending,
            });
            outerTesseract = child;
          }
          // textures for holograms
          if(child.name == "hologram_ball"){
            child.material = new THREE.MeshPhysicalMaterial({
              transmission: 0.9,
              opacity: 0.6,
              roughness: 0.05,
              metalness: 0,
              ior: 1.5,
              emissive: 0x0c1faff,
              emissiveIntensity: 0.7,
              side: THREE.DoubleSide,
              depthWrite: false
            });
          }
          if(child.name == "hologram_cone"){
            child.material = new THREE.MeshPhysicalMaterial({
              transmission: 0.9,
              opacity: 0.5,
              roughness: 0.05,
              metalness: 0,
              ior: 1.5,
              emissive: 0x003335,
              emissiveIntensity: 0.7,
              side: THREE.DoubleSide,
              depthWrite: false
            });
          }
          // video texture for hologram screen
          if(child.name.includes("hologram_screen")){
            child.material = new THREE.MeshBasicMaterial({
              opacity: 0.5,
              transparent: true,
              depthWrite: false,
              map: holoVideoTexture,
              side: THREE.DoubleSide,
            });
            child.material.color.setHex(0x00bd99);
            child.material.color.multiplyScalar(5);
          }
        }
      });
    }
  });
  scene.add(glb.scene);
});

/* END OF MAIN FUNCTION TO LOAD MODEL AND ADJUST TEXTURES */

/* SETTING UP SCENE, CAMERA, AND LIGHTING */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create an Effect Composer
const composer = new EffectComposer(renderer);

// Create a Render Pass (renders the scene)
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// unreal bloom pass initialization
const unrealBloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.1,
  1
);
composer.addPass(unrealBloomPass);

// initialize cube of scene
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// initialize controls and camera
const controls = new OrbitControls( camera, renderer.domElement );

// limit camera angles
controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = Math.PI / 2.25 ;
controls.maxAzimuthAngle = -Math.PI / 1;

// limit camera zoom
controls.minDistance = 5;
controls.maxDistance = 40;

// other initialization factors
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.update();

// set starting camera position here
camera.position.set(12, 16, -12);
controls.target.set(0, 8, 0);

// Event Listeners (triggers)
window.addEventListener("resize", ()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Camera updating
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Renderer Updating
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/* END OF SETTING UP SCENE, CAMERA, AND LIGHTING */

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
  // gather the two parts: always the one under the pointer,
  // plus the inner if you hovered the outer
  const targets = [ object ];
  if (object === outerTesseract && innerTesseract) {
    targets.push(innerTesseract);
  }

  // kill any running tweens on scale or rotation
  targets.forEach(t => {
    gsap.killTweensOf(t.scale);
    gsap.killTweensOf(t.rotation);
  });

  if (isHovering) {
    targets.forEach(target => {
      // larger scale for inner, slightly less for outer
      const factor = 1.2;

      // scale up
      gsap.to(target.scale, {
        x: target.userData.initialScale.x * factor,
        y: target.userData.initialScale.y * factor,
        z: target.userData.initialScale.z * factor,
        duration: 0.3,
        ease: "expo.inOut"
      });

      // spin forever around Y
      gsap.to(target.rotation, {
        y: target.userData.initialRotation.y + Math.PI * 1,
        duration: 0.5,
        ease: "none",
        onComplete: () => {
          object.userData.isAnimating = false;
        }
      });
    });
  } else {
    targets.forEach(target => {

      // scale back down
      gsap.to(target.scale, {
        x: target.userData.initialScale.x,
        y: target.userData.initialScale.y,
        z: target.userData.initialScale.z,
        duration: 0.3,
        ease: "expo.inOut"
      });

      // stop spin and reset rotation
      gsap.to(target.rotation, {
        y: target.userData.initialRotation.y,
        duration: 0.5,
        ease: "expo.inOut",
        onComplete: () => {
          object.userData.isAnimating = false;
        }
      });
    });
  }
}

// mouse-hovering animation for monitor screen
function screenHoverAnimation(object, isHovering) {
  gsap.killTweensOf(object.material.color);

  if (isHovering) {
    gsap.to(object.material.color, {
      // Animate the 'r', 'g', and 'b' components to brighten the color
      r: 1.1,
      g: 1.1,
      b: 1.1,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.in",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    });
  } else {
    gsap.to(object.material.color, {
      r: 0.75,
      g: 0.75,
      b: 0.75,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    });
  }
}

// mouse hovering animation for chair
function chairHoverAnimation(object, isHovering) {
  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.rotation);
  gsap.killTweensOf(object.position);
  
  if(isHovering){
    gsap.to(object.rotation, {
      y: object.userData.initialRotation.y * 1.2 + Math.PI / 6,
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    })
  } else {
    gsap.to(object.rotation, {
      y: object.userData.initialRotation.y,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => {
        object.userData.isAnimating = false;
      }
    })
  }
}

/* END OF MOUSE HOVERING ANIMATIONS */

/* RENDER FUNCTION TO CONTINUOSLY RENDER MODELS FOR CHANGES */
let time = 0;
const render = () => {
  controls.update();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Rotate the fans
  fans.forEach(fan => {
     fan.rotation.y += 0.05;
  });

  // fluctuate tesseract brightness
  time += 0.008;
  tesseracts.forEach(tess => {
    const intensityFactor = Math.sin(time * 2) * 0.5 + 1;
    tess.material.emissiveIntensity = innerOriginalIntensity * intensityFactor;
  })

  // raycaster (mouse interactions)
  raycaster.setFromCamera( pointer, camera );
	currentIntersects = raycaster.intersectObjects(raycasterObjects);

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
      if (currentIntersectObject.name.includes("chair")) {
        if (currentIntersectObject !== currentHoveredChair) {
          if (currentHoveredChair)
            chairHoverAnimation(currentHoveredChair, false);
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
    if (currentHoveredChair) {
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