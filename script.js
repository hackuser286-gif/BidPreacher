// ---------------- ALIEN DATA ----------------
const aliens = [
  { name: "Heatblast", img: "aliens/heatblast.png" },
  { name: "Four Arms", img: "aliens/fourarms.png" },
  { name: "Diamondhead", img: "aliens/diamondhead.png" },
  { name: "XLR8", img: "aliens/xlr8.png" },
  { name: "Wildmutt", img: "aliens/wildmutt.png" }
];

let currentIndex = 0;
let state = "idle"; // idle | selecting | transformed
let transformedAlien = null;

// ---------------- ELEMENTS ----------------
const dial = document.getElementById("dial");
const holo = document.getElementById("holo");
const holoImage = document.getElementById("holoImage");
const holoName = document.getElementById("holoName");
const flash = document.getElementById("flash");
const statusText = document.getElementById("statusText");

// ---------------- FUNCTIONS ----------------
function showHologram(index) {
  holoImage.src = aliens[index].img;
  holoName.textContent = aliens[index].name;
}

function activateFlash(color = "white") {
  flash.style.background = color;
  flash.classList.add("active");
  setTimeout(() => {
    flash.classList.remove("active");
  }, 600);
}

function updateStatus(msg) {
  statusText.textContent = msg;
}

// ---------------- STATE HANDLING ----------------
function handleDialTap() {
  if (state === "idle") {
    // Open dial → hologram mode
    state = "selecting";
    holo.classList.add("active");
    showHologram(currentIndex);
    updateStatus("Select an alien...");
  } else if (state === "selecting") {
    // Lock alien → transform
    state = "transformed";
    transformedAlien = aliens[currentIndex];
    activateFlash("lime");
    holo.classList.remove("active");
    updateStatus(`Transformed into ${transformedAlien.name}!`);
  } else if (state === "transformed") {
    // Revert to human
    state = "idle";
    transformedAlien = null;
    activateFlash("red");
    holo.classList.remove("active");
    updateStatus("Reverted to human form.");
  }
}

// Rotate dial to cycle aliens
function rotateDial(direction) {
  if (state !== "selecting") return;
  if (direction === "left") {
    currentIndex = (currentIndex - 1 + aliens.length) % aliens.length;
  } else {
    currentIndex = (currentIndex + 1) % aliens.length;
  }
  showHologram(currentIndex);
}

// ---------------- EVENT LISTENERS ----------------
dial.addEventListener("click", handleDialTap);

// Rotate with arrow keys
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") rotateDial("left");
  if (e.key === "ArrowRight") rotateDial("right");
});
