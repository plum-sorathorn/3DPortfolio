import * as THREE from 'three';
import { store } from './store.js';

// to load textures
store.textureLoader = new THREE.TextureLoader();

// Pre‑calculate texture keys & load textures
store.textureKeys = Object.keys(store.textureMap);
store.loadedTextures = { texture: {} };

for (const key of store.textureKeys) {
  const path = store.textureMap[key].texture;
  if (path) {
    const tex = store.textureLoader.load(path);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    store.loadedTextures.texture[key] = tex;
  }
}