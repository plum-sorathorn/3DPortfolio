import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { store } from './store.js';

/* SETTING UP SCENE, CAMERA, AND LIGHTING */
store.scene = new THREE.Scene();
store.camera = new THREE.PerspectiveCamera(75, store.sizes.width / store.sizes.height, 0.1, 1000);

const canvas = document.getElementById('experience-canvas') || document.createElement('canvas');
if (!canvas.isConnected) document.body.appendChild(canvas);
store.canvas   = canvas;
store.renderer = new THREE.WebGLRenderer({ canvas, antialias:true, powerPreference:'high-performance' });
store.renderer.setSize(store.sizes.width, store.sizes.height);
const pr = Math.min(window.devicePixelRatio, 2);
store.renderer.setPixelRatio(pr);

store.composer = new EffectComposer(store.renderer);
store.renderPass = new RenderPass(store.scene, store.camera);
store.composer.addPass(store.renderPass);
store.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.6, 0.05, 0.9);
store.composer.addPass(store.unrealBloomPass);

store.controls = new OrbitControls(store.camera, store.renderer.domElement);
store.controls.minPolarAngle = 0;
store.controls.maxPolarAngle = Math.PI / 2;
store.controls.minAzimuthAngle = Math.PI / 2.25;
store.controls.maxAzimuthAngle = -Math.PI / 1;
store.controls.minDistance = 5;
store.controls.maxDistance = 40;
store.controls.enableDamping = true;
store.controls.dampingFactor = 0.05;

store.controls.update();

// set starting position and camera angle
if (window.innerWidth < 768) {
  // Adjust for smaller screens (e.g., phones)
  store.camera.position.set(22, 25, -22);
  store.controls.target.set(0, 8, 0);
} else {
  // Default position for larger screens
  store.camera.position.set(12, 15, -12);
  store.controls.target.set(0, 10, 0);
}

const v = new THREE.Vector3();
const minPan = new THREE.Vector3(-7,  3, -5);
const maxPan = new THREE.Vector3( 7, 15,  7);

store.controls.addEventListener('change', () => {
  v.copy(store.controls.target);
  store.controls.target.clamp(minPan, maxPan);
  v.sub(store.controls.target);
  store.camera.position.sub(v);
});

/* Debounce resize */
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    store.sizes.width = window.innerWidth;
    store.sizes.height = window.innerHeight;

    // Camera updating
    store.camera.aspect = store.sizes.width / store.sizes.height;
    store.camera.updateProjectionMatrix();

    // Renderer Updating
    store.renderer.setSize(store.sizes.width, store.sizes.height);
    store.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, 50);
});