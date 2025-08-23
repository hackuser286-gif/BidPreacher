const aliens = [
  { name: "Heatblast", img: "aliens/heatblast.png" },
  { name: "Wildmutt", img: "aliens/wildmutt.png" },
  { name: "Diamondhead", img: "aliens/diamondhead.png" },
  { name: "XLR8", img: "aliens/xlr8.png" },
  { name: "Grey Matter", img: "aliens/greymatter.png" },
  { name: "Four Arms", img: "aliens/fourarms.png" },
  { name: "Stinkfly", img: "aliens/stinkfly.png" },
  { name: "Ripjaws", img: "aliens/ripjaws.png" },
  { name: "Upgrade", img: "aliens/upgrade.png" },
  { name: "Ghostfreak", img: "aliens/ghostfreak.png" },
  { name: "Cannonbolt", img: "aliens/cannonbolt.png" },
  { name: "Wildvine", img: "aliens/wildvine.png" },
  { name: "Spitter", img: "aliens/spitter.png" },
  { name: "Blitzwolfer", img: "aliens/blitzwolfer.png" },
  { name: "Snare-oh", img: "aliens/snareoh.png" },
  { name: "Frankenstrike", img: "aliens/frankenstrike.png" },
  { name: "Upchuck", img: "aliens/upchuck.png" },
  { name: "Ditto", img: "aliens/ditto.png" },
  { name: "Eye Guy", img: "aliens/eyeguy.png" },
  { name: "Way Big", img: "aliens/waybig.png" }
];

// Elements
const dial = document.getElementById("dial");
const holoImage = document.getElementById("holoImage");
const holoName = document.getElementById("holoName");
const hologram = document.querySelector(".hologram");
const flash = document.getElementById("flash");
const statusText = document.getElementById("statusText");

let currentIndex = 0;
let rotation = 0;
let transformed = false; // track transformation state

// Rotate dial
function rotateDial(direction) {
  if (transformed) return; // can’t rotate while transformed

  const step = 360 / aliens.length;
  if (direction === "next") {
    currentIndex = (currentIndex + 1) % aliens.length;
    rotation += step;
  } else if (direction === "prev") {
    currentIndex = (currentIndex - 1 + aliens.length) % aliens.length;
    rotation -= step;
  }

  dial.style.transform = `rotate(${rotation}deg)`;

  // Show hologram only after selecting
  hologram.style.display = "block";
  holoImage.src = aliens[currentIndex].img;
  holoName.textContent = aliens[currentIndex].name;
  statusText.textContent = `Selected: ${aliens[currentIndex].name}`;
}

// Transform
function transform() {
  if (!hologram.style.display || hologram.style.display === "none") return; // must select first

  if (!transformed) {
    // Transform into alien
    flash.style.background = "rgba(0,255,0,0.8)"; // green flash
    flash.style.opacity = 1;
    setTimeout(() => {
      flash.style.opacity = 0;
      statusText.textContent = `Transformed into ${aliens[currentIndex].name}!`;
    }, 300);
    transformed = true;
  } else {
    // Revert back to normal
    flash.style.background = "rgba(255,0,0,0.8)"; // red flash
    flash.style.opacity = 1;
    setTimeout(() => {
      flash.style.opacity = 0;
      statusText.textContent = `Back to human form.`;
      hologram.style.display = "none"; // hide hologram again
    }, 300);
    transformed = false;
  }
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") rotateDial("next");
  if (e.key === "ArrowLeft") rotateDial("prev");
  if (e.key === "Enter") transform();
});

dial.addEventListener("click", transform);

// Swipe for mobile
let startX = 0;
dial.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
dial.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  if (endX < startX - 30) rotateDial("next");
  if (endX > startX + 30) rotateDial("prev");
});

// Init
hologram.style.display = "none"; // hide hologram initially
statusText.textContent = "Tap dial to select alien";
