import './style.scss';
import { changeText } from './controls.js';

// Pull in side‑effect modules first (they populate `store`)
import './constants.js';
import './dom.js';
import './video.js';
import './textures.js';
import './scene.js';
import './raycaster.js';

import { loadRoomModel }   from './modelLoader.js';
import './interactions.js';
import { startRenderLoop } from './render.js';
import { initRenderer } from './scene.js';

// change to async so it can be deployed
document.addEventListener('DOMContentLoaded', async () => {
    initRenderer();
    await loadRoomModel();
    startRenderLoop();
  });