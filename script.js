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
  { name: "Four Arms", img: "aliens/fourarms.png" },
  { name: "Grey Matter", img: "aliens/greymatter.png" },
];

let currentAlien = 0;
let isTransformed = false;

// Rotate dial + show hologram
dial.addEventListener("click", () => {
  if (isTransformed) return; // can't switch while transformed

  currentAlien = (currentAlien + 1) % aliens.length;

  // Rotate dial visually
  dial.style.transform = `rotate(${currentAlien * 36}deg)`;

  // Update hologram
  holoImage.src = aliens[currentAlien].img;
  holoName.textContent = aliens[currentAlien].name;
  hologram.classList.add("active");
  statusText.textContent = `Selected ${aliens[currentAlien].name}`;
});

// Transform / revert on double tap
dial.addEventListener("dblclick", () => {
  flash.classList.add("active");

  setTimeout(() => {
    flash.classList.remove("active");

    if (!isTransformed) {
      statusText.textContent = `Transformed into ${aliens[currentAlien].name}`;
    } else {
      statusText.textContent = "Back to normal";
      hologram.classList.remove("active");
    }

    isTransformed = !isTransformed;
  }, 200);
});
