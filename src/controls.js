export function changeText() {
  
  const textElement = document.getElementById("controls-text");
  if (!textElement) return;

  let newText;
  if (window.innerWidth > 0 && window.innerWidth < 768) {
    newText = "tap or drag to interact!";
  } else {
    newText = "click or drag to interact!";
  }
  document.getElementById("controls-text").textContent = newText;
  }
  
  window.onload = changeText;
  window.onresize = changeText;