export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGL2RenderingContext
        ? canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2')
        : canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
  } catch (e) {
    return false;
  }
}

  
  // reveal our banner and set its message
  export function showWebGLBanner() {
    const banner = document.getElementById('webgl-banner');
    if (!banner) return;
    banner.textContent =
      'WebGL is disabled or unavailable. Please enable it in Safari -> Develop -> Experimental Features -> WebGL 2.0 (or WebGL 1.0).';
    banner.style.display = 'flex';
    banner.style.bottom = '30vh';
  }