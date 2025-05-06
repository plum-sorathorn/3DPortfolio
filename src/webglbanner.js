export function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
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
      'WebGL is disabled or unavailable. Please enable it in Safari → Develop → Experimental Features.';
    banner.style.display = 'flex';
    banner.style.bottom = '30vh';
  }