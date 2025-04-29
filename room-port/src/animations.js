import gsap from 'gsap';
import * as THREE from 'three';
import { store } from './store.js';

/* START OF DEFAULT ANIMATION FUNCTIONS */
// Default pulsing animation for the monitor screen
export function startMonitorPulse(object) {
  if (object && object.material.color && !object.userData.isHovered) {
    gsap.killTweensOf(object.material.color);

    if (!object.userData.pulseTween || !object.userData.pulseTween.isActive()) {
      object.userData.pulseTween = gsap.to(object.material.color, {
        r: object.material.color.r * 1.9,
        g: object.material.color.g * 1.9,
        b: object.material.color.b * 1.9,
        duration: 0.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    } else {
      object.userData.pulseTween.resume();
    }
  }
}
/* END OF DEFAULT ANIMATION FUNCTIONS */


/* START OF MOUSE HOVERING ANIMATIONS */
// mouse‑hovering animation for contacts
export function contactsHoverAnimation(object, isHovering){
  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.rotation);
  gsap.killTweensOf(object.position);
  
  if(isHovering){
    gsap.to(object.scale, {
      x: object.userData.initialScale.x * 1.2,
      y: object.userData.initialScale.y * 1.2,
      z: object.userData.initialScale.z * 1.2,
      duration: 0.5,
      ease: "bounce.out(1.8)",
    });
    gsap.to(object.rotation, {
      y: object.userData.initialRotation.y * 1.2 + -Math.PI / 6,
      duration: 0.5,
      ease: "bounce.out(1.8)",
      onComplete: () => { object.userData.isAnimating = false; }
    });
  } else {
    gsap.to(object.scale, {
      x: object.userData.initialScale.x,
      y: object.userData.initialScale.y,
      z: object.userData.initialScale.z,
      duration: 0.3,
      ease: "bounce.out(1.8)",
    });
    gsap.to(object.rotation, {
      y: object.userData.initialRotation.y,
      duration: 0.5,
      ease: "bounce.out(1.8)",
      onComplete: () => { object.userData.isAnimating = false; }
    });
  }
}

// mouse‑hovering animation for frames
export function framesHoverAnimation(object, isHovering) {
  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.position);

  if (isHovering) {
    gsap.to(object.scale, {
      x: object.userData.initialScale.x * 1.3,
      y: object.userData.initialScale.y * 1.3,
      z: object.userData.initialScale.z * 1.3,
      duration: 0.3,
      ease: "expo.inOut(1.8)",
    });

    gsap.to(object.position, {
      x: object.userData.initialPosition.x / 1.05,
      duration: 0.3,
      ease: "expo.inOut(1.8)",
      onComplete: () => { object.userData.isAnimating = false; }
    });
  } else {
    gsap.to(object.scale, {
      x: object.userData.initialScale.x,
      y: object.userData.initialScale.y,
      z: object.userData.initialScale.z,
      duration: 0.3,
      ease: "expo.inOut",
    });

    gsap.to(object.position, {
      x: object.userData.initialPosition.x,
      duration: 0.5,
      ease: "expo.inOut",
      onComplete: () => { object.userData.isAnimating = false; }
    });
  }
}

// mouse‑hovering animation for hologram
export function hologramHoverAnimation(object, isHovering) {
  gsap.killTweensOf(object.material.color);
  gsap.killTweensOf(store.holoVideo);

  if (isHovering) {
    gsap.to(object.material.color, { color: object.material.color.multiplyScalar(1.5) });
    gsap.to(store.holoVideo, {
      playbackRate: 5,
      duration: 0.5,
      ease: "power2",
      onComplete: () => { object.userData.isAnimating = false; }
    });
  } else {
    gsap.to(object.material.color, { color: object.material.color.multiplyScalar(2/3) });
    gsap.to(store.holoVideo, {
      playbackRate: 1,
      duration: 0.5,
      ease: "power2",
      onComplete: () => { object.userData.isAnimating = false; }
    });
  }
}

// mouse‑hovering animation for tesseract
export function tesseractHoverAnimation(object, isHovering) {
  if (object.userData.isClicked) return;

  const targets = [object];
  if (object === store.outerTesseract && store.innerTesseract) targets.push(store.innerTesseract);

  targets.forEach(t => {
    gsap.killTweensOf(t.scale);
    gsap.killTweensOf(t.rotation);
  });

  if (isHovering) {
    // scale up + spin once
    targets.forEach(target => {
      gsap.to(target.scale, {
        x: target.userData.initialScale.x * 1.2,
        y: target.userData.initialScale.y * 1.2,
        z: target.userData.initialScale.z * 1.2,
        duration: 0.3,
        ease: "expo.inOut",
      });
      gsap.to(target.rotation, {
        y: target.userData.initialRotation.y + Math.PI,
        duration: 0.5,
        ease: "none",
      });
    });
  } else {
    // reset to initial
    targets.forEach(target => {
      gsap.to(target.scale, {
        x: target.userData.initialScale.x,
        y: target.userData.initialScale.y,
        z: target.userData.initialScale.z,
        duration: 0.3,
        ease: "expo.inOut",
      });
      gsap.to(target.rotation, {
        x: target.userData.initialRotation.x,
        y: target.userData.initialRotation.y,
        z: target.userData.initialRotation.z,
        duration: 0.5,
        ease: "expo.inOut",
      });
    });
  }
}

// mouse‑hovering animation for chair
export function chairHoverAnimation(object, isHovering) {
  gsap.killTweensOf(object.rotation);

  if (isHovering) {
    object.userData.isAnimating = true;

    gsap.to(object.rotation, {
      y: object.userData.initialRotation.y + Math.PI / 16,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.to(object.rotation, {
          y: object.userData.initialRotation.y,
          duration: 0.2,
          ease: "power2.inOut",
          onComplete: () => { object.userData.isAnimating = false; }
        });
      },
    });
  } else {
    // reset on hover‑out
    gsap.to(object.rotation, {
      x: object.userData.initialRotation.x,
      y: object.userData.initialRotation.y,
      z: object.userData.initialRotation.z,
      duration: 0.3,
      ease: "power1.out",
      onComplete: () => { object.userData.isAnimating = false; }
    });
  }
}
/* END OF MOUSE HOVERING ANIMATIONS */


/* START OF MOUSE CLICK ANIMATIONS */
export function chairClickAnimation(object) {
  gsap.killTweensOf(object.rotation);
  gsap.to(object.rotation, {
    y: object.userData.initialRotation.y + Math.PI / 6,
    duration: 1.5,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    onComplete: () => { object.userData.isAnimating = false; }
  });
}

export function tesseractClickAnimation(object) {
  const targets = [object];
  if (object === store.outerTesseract && store.innerTesseract) {
    targets.push(store.innerTesseract);
  }

  targets.forEach(t => {
    gsap.killTweensOf(t.rotation);
    gsap.killTweensOf(t.scale);
  });

  if (object.userData.isClicked) {
    targets.forEach(target => {
      gsap.to(target.scale, {
        x: target.userData.initialScale.x * 1.2,
        y: target.userData.initialScale.y * 1.2,
        z: target.userData.initialScale.z * 1.2,
        duration: 0.3,
        ease: "expo.inOut",
      });
      gsap.to(target.rotation, {
        y: "+=" + 5,
        duration: 2,
        ease: "none",
        repeat: -1,
      });
    });
  } else {
    targets.forEach(target => {
      gsap.to(target.scale, {
        x: target.userData.initialScale.x,
        y: target.userData.initialScale.y,
        z: target.userData.initialScale.z,
        duration: 0.3,
        ease: "expo.inOut",
      });
      gsap.to(target.rotation, {
        x: target.userData.initialRotation.x,
        y: target.userData.initialRotation.y,
        z: target.userData.initialRotation.z,
        duration: 0.5,
        ease: "expo.inOut",
      });
    });
  }
}

export function holoscreenClickAnimation(object) {
  // Create simple particle burst effect
  const particleCount = 50;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  particles.position.copy(object.position);
  store.scene.add(particles);

  gsap.to(particles.scale, { x: 10, y: 10, z: 10, duration: 1, ease: "power2.out" });
  gsap.to(material, {
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      store.scene.remove(particles);
      geometry.dispose();
      material.dispose();
    },
  });
}
/* END OF MOUSE CLICK ANIMATIONS */