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
        } else if (child.name === "pc_glass") {
          store.pc_glass = child;
          child.userData.originalScale = child.scale.clone();
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
        } else if (child.name === "hologram_screen_raycaster") {
          store.hologram_screen = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "hologram_cone") {
          store.hologram_cone = child;
          child.userData.originalScale = child.scale.clone();
          child.scale.set(0, 0, 0);
        } else if (child.name === "chair_top_raycaster") {
          store.chair_top = child;
          child.userData.originalScale = child.scale.clone();
        } else if (child.name === "chair_bottom") {
          store.chair_bottom = child;
          child.userData.originalScale = child.scale.clone();
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
            if (material.map) material.map.minFilter = THREE.LinearMipmapLinearFilter;
          }

          child.material = material;
          // END OF INITIALIZING TEXTURES */

          // Fix table corner triangulation artifacts from Blender modeling via code
          if (child.name === "table") {
            if (child.geometry.index) {
              child.geometry = child.geometry.toNonIndexed();
            }
            const posAttr = child.geometry.attributes.position;
            const uvAttr = child.geometry.attributes.uv;
            const triCount = posAttr.count / 3;

            // Bounding box of the corner fan region
            const xMin = -0.502, xMax = 0.192;
            const zMin = 0.151, zMax = 0.816;
            // Safe bounds within the clean oak plank on TextureSet2_table.webp
            const uMin = 0.235, uMax = 0.385;
            const vMin = 0.605, vMax = 0.965;

            for (let i = 0; i < triCount; i++) {
              const i0 = i * 3, i1 = i * 3 + 1, i2 = i * 3 + 2;
              const y0 = posAttr.getY(i0), y1 = posAttr.getY(i1), y2 = posAttr.getY(i2);
              if (y0 > 0.698 && y1 > 0.698 && y2 > 0.698) {
                const z0 = posAttr.getZ(i0), z1 = posAttr.getZ(i1), z2 = posAttr.getZ(i2);
                const x0 = posAttr.getX(i0), x1 = posAttr.getX(i1), x2 = posAttr.getX(i2);
                if (z0 >= 0.150 && z1 >= 0.150 && z2 >= 0.150 && x0 <= 0.193 && x1 <= 0.193 && x2 <= 0.193) {
                  for (let v = 0; v < 3; v++) {
                    const vi = i * 3 + v;
                    const vx = posAttr.getX(vi);
                    const vz = posAttr.getZ(vi);
                    const nx = Math.min(Math.max((vx - xMin) / (xMax - xMin), 0), 1);
                    const nz = Math.min(Math.max((vz - zMin) / (zMax - zMin), 0), 1);
                    uvAttr.setXY(vi, uMin + nx * (uMax - uMin), vMin + nz * (vMax - vMin));
                  }
                }
              }
            }
            uvAttr.needsUpdate = true;
          }


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