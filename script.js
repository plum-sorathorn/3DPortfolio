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

// Hologram Overlay
document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("experience-overlay");
    const closeBtn = document.querySelector(".close-btn");

    // Function to show overlay
    function showOverlay() {
        overlay.classList.remove("hidden");
    }

    // Function to close overlay
    function closeOverlay() {
        overlay.classList.add("hidden");
    }

    // Close when clicking the 'X' button
    closeBtn.addEventListener("click", closeOverlay);

    // Close when clicking outside overlay content
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) {
            closeOverlay();
        }
    });

    // Open overlay manually for testing
    document.addEventListener("keydown", function(event) {
        if (event.key === "o") { // Press "O" to open overlay
            showOverlay();
        }
    });
});
