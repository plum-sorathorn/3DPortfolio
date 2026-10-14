import * as THREE from 'three';
import { store } from './store.js';

// to load textures using the centralized loading manager
store.textureLoader = new THREE.TextureLoader(store.manager);

// Pre‑calculate texture keys & load textures with cache deduplication
store.textureKeys = Object.keys(store.textureMap);
store.loadedTextures = { texture: {} };
const textureCache = {};

for (const key of store.textureKeys) {
  const path = store.textureMap[key].texture;
  if (path) {
    if (!textureCache[path]) {
      const tex = store.textureLoader.load(path);
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      textureCache[path] = tex;
    }
    store.loadedTextures.texture[key] = textureCache[path];
  }
}