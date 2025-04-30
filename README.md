# 3D Portfolio

An interactive, 3D portfolio rendered with **Blender** and built with **Three.js**, **Node.js**, **Vite**, and more.

## Live Website
https://www.splum.org/

## Features

- **Immersive 3D Room**: A fully modeled room environment loaded via GLTF/DRACO.
- **Interactive Objects**:  
  - **Certifications**: Click on framed certificates to view details in a modal.  
  - **Hologram Screen**: Plays looping video; hover to speed up playback.  
  - **Tesseract**: Hover and click animations for inner and outer tesseracts.  
  - **Chair**: Subtle hover tilt and click spin animations.  
  - **Monitor**: Pulsing animation and click to open an embedded webpage.  
  - **Fans**: Continuous rotation animation.
- **Orbit Controls**: Intuitive camera controls with panning limits for desktop and mobile.
- **Responsive Design**: Adjusts camera and controls for different screen sizes or devices.
- **Custom Shaders & Materials**: Physical and basic materials for glass, hologram, and emissive effects.
- **Loading Screen**: GSAP-powered loading screen with an “Enter” button to trigger the intro animation.

## Project Structure
```
├── index.html           # Main HTML entrypoint 
├── src
│   ├── main.js          # Boots the app: loads model & starts render loop
│   ├── style.scss       # Global styles & loading screen
│   ├── constants.js     # Shared variables & asset mappings
│   ├── dom.js           # DOM caching & modal logic
│   ├── textures.js      # Texture loading & mapping
│   ├── scene.js         # Scene, camera, lighting & postprocessing setup
│   ├── raycaster.js     # Raycaster & pointer handlers
│   ├── modelLoader.js   # GLTF/DRACO model loading & material assignment
│   ├── render.js        # Main render loop with animations & raycasting
│   ├── interactions.js  # Click/touch event handling
│   ├── animations.js    # GSAP animation definitions
│   └── helpers.js       # Utility functions (e.g., pointer update)
├── public
│   ├── draco            # 3D data compression
│   ├── models           # GLB model assets
│   ├── textures         # Image & video assets
│   ├── iframes          # Embedded iframe pages
│   ├── music            # mp3 file for background music
│   └── images           # certification images

├── package.json         # NPM scripts & dependencies

└── vite.config.js       # Vite configuration
```

## Technologies
- **JavaScript** (ES6+)
- **Node.js** & **npm**
- **Vite**
- **Sass (SCSS)**
- **Three.js**
- **HTML5**

Controls
- Orbit: Click + drag (PC) or touch + drag to rotate camera (Mobile)
- Zoom: Scroll (PC) or pinch (Mobile)
- Pan: Shift + click (PC)
- Click: Object Interaction

