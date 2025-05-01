import { store } from './store.js';
import gsap from 'gsap';

// Function to animate all objects in sequence
export function startIntroAnimation() {

    // intro animation for shelf objects
    const timelineRight = gsap.timeline({
        duration: 1,
        ease: "back.out(1.8)",
    });

    timelineRight.to(store.tesseract_inner_raycaster.scale, {
        x: store.tesseract_inner_raycaster.userData.originalScale.x,
        y: store.tesseract_inner_raycaster.userData.originalScale.y,
        z: store.tesseract_inner_raycaster.userData.originalScale.z,
    },).to(store.tesseract_outer_raycaster.scale, {
        x: store.tesseract_outer_raycaster.userData.originalScale.x,
        y: store.tesseract_outer_raycaster.userData.originalScale.y,
        z: store.tesseract_outer_raycaster.userData.originalScale.z,
    },).to(store.linkedin_raycaster.scale, {
        x: store.linkedin_raycaster.userData.originalScale.x,
        y: store.linkedin_raycaster.userData.originalScale.y,
        z: store.linkedin_raycaster.userData.originalScale.z,
    },"-=0.2").to(store.github_raycaster.scale, {
        x: store.github_raycaster.userData.originalScale.x,
        y: store.github_raycaster.userData.originalScale.y,
        z: store.github_raycaster.userData.originalScale.z,
    },"-=0.2").to(store.frame3_screen.scale, {
        x: store.frame3_screen.userData.originalScale.x,
        y: store.frame3_screen.userData.originalScale.y,
        z: store.frame3_screen.userData.originalScale.z,
    },"-=0.2").to(store.frame2_screen.scale, {
        x: store.frame2_screen.userData.originalScale.x,
        y: store.frame2_screen.userData.originalScale.y,
        z: store.frame2_screen.userData.originalScale.z,
    },"-=0.2").to(store.frame1_screen.scale, {
        x: store.frame1_screen.userData.originalScale.x,
        y: store.frame1_screen.userData.originalScale.y,
        z: store.frame1_screen.userData.originalScale.z,
    },"-=0.2");

    // intro animation for hologram objects
    const timelineLeft = gsap.timeline({
        duration: 1.4,
        ease: "back.out(1.8)",
    });

    timelineLeft.to(store.hologram_cone.scale, {
        x: store.hologram_cone.userData.originalScale.x,
        y: store.hologram_cone.userData.originalScale.y,
        z: store.hologram_cone.userData.originalScale.z,
    },"+=0.1").to(store.hologram_screen.scale, {
        x: store.hologram_screen.userData.originalScale.x,
        y: store.hologram_screen.userData.originalScale.y,
        z: store.hologram_screen.userData.originalScale.z,
    },"+=0.1").to(store.fans1.scale, {
        x: store.fans1.userData.originalScale.x,
        y: store.fans1.userData.originalScale.y,
        z: store.fans1.userData.originalScale.z,
    },"-=0.2").to(store.fans2.scale, {
        x: store.fans2.userData.originalScale.x,
        y: store.fans2.userData.originalScale.y,
        z: store.fans2.userData.originalScale.z,
    },"-=0.2").to(store.fans3.scale, {
        x: store.fans3.userData.originalScale.x,
        y: store.fans3.userData.originalScale.y,
        z: store.fans3.userData.originalScale.z,
    },"-=0.2");

    // intro animation for chair, monitor, and keyboard (center objects)
    const timelineCenter = gsap.timeline({
        duration: 1.9,
        ease: "back.out(1.8)",
    });

    timelineCenter.to(store.keyboard.scale, {
        x: store.keyboard.userData.originalScale.x,
        y: store.keyboard.userData.originalScale.y,
        z: store.keyboard.userData.originalScale.z,
    },"+=1").to(store.monitor_screen.scale, {
        x: store.monitor_screen.userData.originalScale.x,
        y: store.monitor_screen.userData.originalScale.y,
        z: store.monitor_screen.userData.originalScale.z,
    },"+=0.1");

}