let currentRoom = 0;
const rooms = document.querySelectorAll(".room");
const container = document.getElementById("container");
let isScrolling = false;

window.addEventListener("wheel", (event) => {
    if (isScrolling) return;
    
    if (event.deltaY > 0 && currentRoom < rooms.length - 1) {
        currentRoom++;
    } else if (event.deltaY < 0 && currentRoom > 0) {
        currentRoom--;
    }

    container.style.transform = `translateX(-${currentRoom * 100}vw)`;
    
    isScrolling = true;
    setTimeout(() => isScrolling = false, 800); // Prevent rapid scrolling
});

document.querySelector("button").addEventListener("click", () => {
    currentRoom = 1; // Moves to the "Work Experience" room
    container.style.transform = `translateX(-${currentRoom * 100}vw)`;
});