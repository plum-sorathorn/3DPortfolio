import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.querySelector("#experience-canvas")
const sizes ={
  width: window.innerWidth,
  height: window.innerHeight,
}

// to load textures
const textureLoader = new THREE.TextureLoader();

// to load 3d model
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// load raycaster functions
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

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

// function for raycaster (triggers for mouse-related actions)
window.addEventListener("mousemove", ()=> {

})

// create array of fans to allow for animation
const fans = [];

// create const for inner tesseract for animation
const tesseracts = []
let innerOriginalIntensity = null;

// create const for chair for animation
const chairs = []

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

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
camera.position.z = 5;

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
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 8, 0);
// set camera position here
camera.position.set(10, 16, -10);
controls.update();

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

  composer.render();

  window.requestAnimationFrame(render);
}

render()