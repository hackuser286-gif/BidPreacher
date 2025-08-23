const dial = document.getElementById("dial");
const hologram = document.getElementById("hologram");
const holoImage = document.getElementById("holoImage");
const holoName = document.getElementById("holoName");
const statusText = document.getElementById("statusText");
const flash = document.getElementById("flash");

const aliens = [
  { name: "Heatblast", img: "aliens/heatblast.png" },
  { name: "Wildmutt", img: "aliens/wildmutt.png" },
  { name: "Diamondhead", img: "aliens/diamondhead.png" },
  { name: "XLR8", img: "aliens/xlr8.png" },
  { name: "Grey Matter", img: "aliens/greymatter.png" }
];

let currentAlien = 0;
let isTransformed = false;

// Rotate dial & change alien
dial.addEventListener("click", () => {
  if (isTransformed) return; // can't change while transformed
  currentAlien = (currentAlien + 1) % aliens.length;
  holoImage.src = aliens[currentAlien].img;
  holoName.textContent = aliens[currentAlien].name;
  hologram.style.display = "block";
});

// Transform on double click
dial.addEventListener("dblclick", () => {
  if (!isTransformed) {
    // Transform into alien
    flash.classList.add("active");
    setTimeout(() => {
      flash.classList.remove("active");
      statusText.textContent = `Transformed into ${aliens[currentAlien].name}`;
    }, 300);
    isTransformed = true;
  } else {
    // Revert back
    flash.classList.add("active");
    setTimeout(() => {
      flash.classList.remove("active");
      statusText.textContent = `Back to normal`;
    }, 300);
    isTransformed = false;
  }
});
