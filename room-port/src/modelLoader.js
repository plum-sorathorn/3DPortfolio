import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { store } from './store.js';
import { startMonitorPulse } from './animations.js';
import gsap from 'gsap';

// to load 3D model
store.dracoLoader = new DRACOLoader();
store.dracoLoader.setDecoderPath('/draco/');
store.loader = new GLTFLoader(store.manager);
store.loader.setDRACOLoader(store.dracoLoader);

/* MAIN FUNCTION TO LOAD MODEL AND ADJUST TEXTURES */
export function loadRoomModel() {
  return new Promise(resolve => {
    store.loader.load("/models/room_test-v1.glb", glb => {
      glb.scene.traverse(child => {
        if (!child.isMesh) return;

        /* START OF INTRO ANIMATION SETTINGS */
        if (child.name === "shelf") {
          store.shelf = child;
          child.userData.originalScale = child.scale.clone();
        } else if (child.name === "monitor") {
          store.monitor = child;
          child.userData.originalScale = child.scale.clone();
        } else if (child.name === "monitor_screen_raycaster") {
          store.monitor_screen = child;

          // create clone to blacken monitor
          const bgPlane = child.clone();
          bgPlane.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
          });

          gsap.to(bgPlane.position, {
            z: bgPlane.position.z + 0.1,
            x: bgPlane.position.x - 0.1,
          });

          child.parent.add(bgPlane);

          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "keyboard") {
          store.keyboard = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "frames") {
          store.frames = child;
          child.userData.originalScale = child.scale.clone();
        } else if (child.name === "pc") {
          store.pc = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "pc_glass") {
          store.pc_glass = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "fans1") {
          store.fans1 = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "fans2") {
          store.fans2 = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "fans3") {
          store.fans3 = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "frame1_screen_raycaster") {
          store.frame1_screen = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "frame2_screen_raycaster") {
          store.frame2_screen = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "frame3_screen_raycaster") {
          store.frame3_screen = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "chair_top_raycaster") {
          store.chair_top = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "hologram_screen_raycaster") {
          store.hologram_screen = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "hologram_cone") {
          store.hologram_cone = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "chair_bottom") {
          store.chair_bottom = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "github_raycaster") {
          store.github_raycaster = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "linkedin_raycaster") {
          store.linkedin_raycaster = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "tesseract_inner_raycaster") {
          store.tesseract_inner_raycaster = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "tesseract_outer_raycaster") {
          store.tesseract_outer_raycaster = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        }

        /* END OF INTRO ANIMATION SETTINGS */

        /* START OF INITIALIZING TEXTURES */
        for (const key of store.textureKeys) {
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
            store.fans.push(child);
          } else if (child.name === "tesseract_inner_raycaster") {
            material = new THREE.MeshPhysicalMaterial({
              transmission: 0.9,
              opacity: 0.6,
              roughness: 0.05,
              metalness: 0,
              ior: 1.5,
              emissive: 0x0c1faff,
              emissiveIntensity: 1.5,
              side: THREE.DoubleSide,
              depthWrite: false,
            });
            store.innerOriginalIntensity = material.emissiveIntensity;
            store.innerTesseract         = child;
            store.tesseracts.push(child);
          } else if (child.name === "tesseract_outer_raycaster") {
            material = new THREE.MeshPhysicalMaterial({
              emissive: 0x0c1faff,
              opacity: 0.3,
              metalness: 0,
              roughness: 0.1,
              transparent: true,
              depthWrite: false,
              blendEquation: THREE.AdditiveBlending,
            });
            store.outerTesseract = child;
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
              depthWrite: false,
            });
          } else if (child.name.includes("hologram_screen")) {
            material = new THREE.MeshBasicMaterial({
              opacity: 0.5,
              transparent: true,
              depthWrite: false,
              map: store.holoVideoTexture,
              side: THREE.DoubleSide,
            });
            material.color.setHex(0x00bd99).multiplyScalar(5);
          } else {
            material = new THREE.MeshBasicMaterial({ map: store.loadedTextures.texture[key] });
            if (material.map) material.map.minFilter = THREE.LinearFilter;
          }

          child.material = material;
          // END OF INITIALIZING TEXTURES */

          // initilize raycaster objects
          if (child.name.includes("_raycaster")) {
            store.raycasterObjects.push(child);
            child.userData.initialScale = child.scale.clone();
            child.userData.initialPosition = child.position.clone();
            child.userData.initialRotation = child.rotation.clone();
            child.userData.isAnimating = false;
            child.userData.isClicked = false;
          }

          // initialize monitor screen for flashing
          if (child.name.includes("monitor_screen_raycaster")) {
            store.monitorScreenObject = child;
          }

          break;
        }
      });

      store.scene.add(glb.scene);

      // start flashing animation for monitor screen
      if (store.monitorScreenObject) {
        startMonitorPulse(store.monitorScreenObject);
      }
      resolve();
    });
  });
}
/* END OF MAIN FUNCTION TO LOAD MODEL AND ADJUST TEXTURES */