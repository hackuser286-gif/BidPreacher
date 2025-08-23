// ====== Alien Data ======
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

// ====== Elements ======
const dial = document.getElementById("dial");
const holoImage = document.getElementById("holoImage");
const holoName = document.getElementById("holoName");
const statusText = document.getElementById("statusText");
const flash = document.getElementById("flash");

// ====== State ======
let currentAlien = 0;
let rotation = 0;

// ====== Update Hologram ======
function updateAlien(index) {
  const alien = aliens[index];
  holoImage.src = alien.img;
  holoName.textContent = alien.name;
  statusText.textContent = `Selected: ${alien.name}`;
}

// ====== Dial Rotation ======
let startX = 0;
let isDragging = false;

dial.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
});
dial.addEventListener("mouseup", () => { isDragging = false; });
dial.addEventListener("mouseleave", () => { isDragging = false; });
dial.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  let deltaX = e.clientX - startX;
  if (Math.abs(deltaX) > 50) { // rotate threshold
    if (deltaX > 0) {
      currentAlien = (currentAlien + 1) % aliens.length;
      rotation += 36;
    } else {
      currentAlien = (currentAlien - 1 + aliens.length) % aliens.length;
      rotation -= 36;
    }
    dial.style.transform = `rotate(${rotation}deg)`;
    updateAlien(currentAlien);
    startX = e.clientX;
  }
});

// ====== Mobile touch support ======
dial.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
dial.addEventListener("touchmove", (e) => {
  let deltaX = e.touches[0].clientX - startX;
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      currentAlien = (currentAlien + 1) % aliens.length;
      rotation += 36;
    } else {
      currentAlien = (currentAlien - 1 + aliens.length) % aliens.length;
      rotation -= 36;
    }
    dial.style.transform = `rotate(${rotation}deg)`;
    updateAlien(currentAlien);
    startX = e.touches[0].clientX;
  }
});

// ====== Transform (Tap Dial) ======
dial.addEventListener("click", () => {
  flash.classList.add("active");
  statusText.textContent = `Transforming into ${aliens[currentAlien].name}...`;
  
  setTimeout(() => {
    flash.classList.remove("active");
    statusText.textContent = `${aliens[currentAlien].name} ready!`;
  }, 600);
});

// ====== Initialize ======
updateAlien(currentAlien);
