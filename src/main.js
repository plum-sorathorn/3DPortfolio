import './style.scss';

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

// The GLTF room is large, so await its load before kicking off the loop
await loadRoomModel();
startRenderLoop();