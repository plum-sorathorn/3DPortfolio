// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("three-container").appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Load Blender 3D Room
let room;
const loader = new THREE.GLTFLoader();
loader.load('assets/myRoom.glb', function(gltf) {
    room = gltf.scene;
    scene.add(room);
    room.position.set(0, 0, 0);
    room.scale.set(1, 1, 1);

    // Find the monitor inside the model
    const monitor = room.getObjectByName("monitorScreen");  
    if (monitor) {
        console.log("Monitor found in model!");
        setupMonitorScreen(monitor);
    } else {
        console.warn("Monitor not found in model!");
    }
}, undefined, function(error) {
    console.error("Error loading 3D model:", error);
});

// Camera Position
camera.position.set(-14, 2, 8); // X, Y, Z position (adjust as needed)
camera.lookAt(0, 1.5, 0); // Ensure it faces the right part of the room

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle Resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Monitor Screen Setup

// Select overlay and close button
const overlay = document.getElementById("experience-overlay");
const closeOverlayBtn = document.getElementById("close-overlay");

// Function to flash screen and show overlay
function flashScreen(monitor, callback) {
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const originalMaterial = monitor.material;

    monitor.traverse((child) => {
        if (child.isMesh) {
            child.material = whiteMaterial;
        }
    });

    setTimeout(() => {
        monitor.traverse((child) => {
            if (child.isMesh) {
                child.material = originalMaterial;
            }
        });

        callback(); // Show overlay after flash
    }, 200);
}

// Function to set up monitor click event
function setupMonitorScreen(monitor) {
    monitor.userData.isClickable = true;

    window.addEventListener("click", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(room, true);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.name === "monitorScreen") {
                flashScreen(monitor, () => {
                    overlay.style.display = "flex"; // Show overlay
                });
            }
        }
    });
}

// Close overlay when clicking the close button
closeOverlayBtn.addEventListener("click", () => {
    overlay.style.display = "none"; // Hide overlay when closed
});
