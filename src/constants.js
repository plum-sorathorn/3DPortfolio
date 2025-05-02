import { store } from './store.js';

/* START OF VARIABLE DECLARTIONS */
// create array of fans to allow for animation
store.fans = [];

// create const for inner tesseract for animation
store.tesseracts = [];
store.innerOriginalIntensity = null;
/* END OF VARIABLE DECLARTIONS */

// define links for contact
store.contacts = {
  github_raycaster: "https://github.com/plum-sorathorn/",
  linkedin_raycaster: "https://www.linkedin.com/in/sorathorn-thongpitukthavorn/",
};

// Canvas, renderer sizes (updated by the resize handler in scene.js)
store.sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// variables objects designated for initial animation
let wall, shelf, monitor, monitor_screen, keyboard, frame1_screen, frame2_screen, frame3_screen,
 chair_top, chair_bottom, github_raycaster, linkedin_raycaster, hologram_screen, hologram_cone, 
 tesseract_inner_raycaster, tesseract_outer_raycaster, pc, pc_glass, fans1, fans2, fans3;

// Assign variables to `store`
Object.assign(store, {
  wall,
  shelf,
  monitor,
  monitor_screen,
  keyboard,
  frames,
  frame1_screen,
  frame2_screen,
  frame3_screen,
  chair_top,
  chair_bottom,
  github_raycaster,
  linkedin_raycaster,
  hologram_screen,
  hologram_cone,
  tesseract_inner_raycaster,
  tesseract_outer_raycaster,
  pc,
  pc_glass,
  fans1,
  fans2,
  fans3,
});

/* MAPPING TO TEXTURE FILES */
store.textureMap = {
  bigFloor: { texture: "/textures/test/TextureSet1_floor.webp" },
  wall: { texture: "/textures/test/TextureSet1_room.webp" },
  shelf: { texture: "/textures/test/TextureSet2_shelf.webp" },
  table: { texture: "/textures/test/TextureSet2_table.webp" },
  monitor_screen_raycaster: { texture: "/textures/TextureMon_Back.webp" },
  monitor: { texture: "/textures/test/TextureSet3_monitor.webp" },
  keyboard: { texture: "/textures/test/TextureSet3_keyboard.webp" },
  pc: { texture: "/textures/test/TextureSet4.webp" },
  fans1: {}, fans2: {}, fans3: {},
  frames: { texture: "/textures/test/TextureSet5.webp" },
  frame1_screen_raycaster: { texture: "/textures/TextureCer_Net.webp" },
  frame2_screen_raycaster: { texture: "/textures/TextureCer_CSIS.webp" },
  frame3_screen_raycaster: { texture: "/textures/TextureCer_Sec.webp" },
  drawers: { texture: "/textures/test/TextureSet6.webp" },
  chair_top_raycaster: { texture: "/textures/test/TextureSet7.webp" },
  chair_bottom: { texture: "/textures/test/TextureSet7.webp" },
  github_raycaster: { texture: "/textures/test/TextureSet8_github.webp" },
  linkedin_raycaster: { texture: "/textures/test/TextureSet8_linkedin.webp" },
  hologramBase: { texture: "/textures/test/TextureSet2_holo_base.webp" },
  hologram_screen_raycaster: {},
  hologram_ball: {},
  hologram_cone: {},
  pc_glass: {},
  tesseract_inner_raycaster: {},
  tesseract_outer_raycaster: {},
};
