let currentRoom = 0;
const rooms = document.querySelectorAll(".room");
const container = document.getElementById("container");
let isScrolling = false;

function updateRoom() {
    container.style.transform = `translateX(-${currentRoom * 100}vw)`;

    // Add animation class to the current room
    rooms.forEach((room, index) => {
        const content = room.querySelector(".room-content");
        if (content) {
            if (index === currentRoom) {
                content.classList.add("active");
            } else {
                content.classList.remove("active");
            }
        }
    });
}

window.addEventListener("wheel", (event) => {
    if (isScrolling) return;

    if (event.deltaY > 0 && currentRoom < rooms.length - 1) {
        currentRoom++;
    } else if (event.deltaY < 0 && currentRoom > 0) {
        currentRoom--;
    }

    updateRoom();

    isScrolling = true;
    setTimeout(() => isScrolling = false, 800); // Prevent rapid scrolling
});

// Initialize first room animation
document.addEventListener("DOMContentLoaded", updateRoom);