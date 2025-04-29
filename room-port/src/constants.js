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

// Canvas / renderer sizes (updated by the resize handler in scene.js)
store.sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/* MAPPING TO TEXTURE FILES */
store.textureMap = {
  bigFloor: { texture: "/textures/TextureSet1_floor.webp" },
  wall: { texture: "/textures/TextureSet1_room.webp" },
  shelf: { texture: "/textures/TextureSet2_shelf.webp" },
  table: { texture: "/textures/TextureSet2_table.webp" },
  monitor_screen_raycaster: { texture: "/textures/TextureMon_Back.webp" },
  monitor: { texture: "/textures/TextureSet3_monitor.webp" },
  keyboard: { texture: "/textures/TextureSet3_keyboard.webp" },
  pc: { texture: "/textures/TextureSet4.webp" },
  fans1: {}, fans2: {}, fans3: {},
  frames: { texture: "/textures/TextureSet5.webp" },
  frame1_screen_raycaster: { texture: "/textures/TextureCer_Net.webp" },
  frame2_screen_raycaster: { texture: "/textures/TextureCer_CSIS.webp" },
  frame3_screen_raycaster: { texture: "/textures/TextureCer_Sec.webp" },
  drawers: { texture: "/textures/TextureSet6.webp" },
  chair_top_raycaster: { texture: "/textures/TextureSet7.webp" },
  chair_bottom: { texture: "/textures/TextureSet7.webp" },
  github_raycaster: { texture: "/textures/TextureSet8_github.webp" },
  linkedin_raycaster: { texture: "/textures/TextureSet8_linkedin.webp" },
  hologramBase: { texture: "/textures/TextureSet2_holo_base.webp" },
  hologram_screen_raycaster: {},
  hologram_ball: {},
  hologram_cone: {},
  pc_glass: {},
  tesseract_inner_raycaster: {},
  tesseract_outer_raycaster: {},
};
