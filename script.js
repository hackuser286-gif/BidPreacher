// ===== Alien Data =====
const aliens = [
  { name: "Heatblast", slug: "heatblast" },
  { name: "Wildmutt", slug: "wildmutt" },
  { name: "Diamondhead", slug: "diamondhead" },
  { name: "XLR8", slug: "xlr8" },
  { name: "Grey Matter", slug: "grey-matter" },
  { name: "Four Arms", slug: "four-arms" },
  { name: "Stinkfly", slug: "stinkfly" },
  { name: "Ripjaws", slug: "ripjaws" },
  { name: "Upgrade", slug: "upgrade" },
  { name: "Ghostfreak", slug: "ghostfreak" },
  { name: "Cannonbolt", slug: "cannonbolt" },
  { name: "Wildvine", slug: "wildvine" },
  { name: "Spitter", slug: "spitter" },
  { name: "Blitzwolfer", slug: "blitzwolfer" },
  { name: "Snare-oh", slug: "snare-oh" },
  { name: "Frankenstrike", slug: "frankenstrike" },
  { name: "Upchuck", slug: "upchuck" },
  { name: "Ditto", slug: "ditto" },
  { name: "Eye Guy", slug: "eye-guy" },
  { name: "Way Big", slug: "way-big" }
];

let currentAlien = 0;

// ===== Elements =====
const hologramImg = document.getElementById("alienHologram");
const hologramName = document.getElementById("alienName");
const statusText = document.getElementById("statusText");
const flash = document.getElementById("flash");

const dial = document.getElementById("dial");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const transformBtn = document.getElementById("transformBtn");

// ===== Functions =====
function updateHologram(index) {
  const alien = aliens[index];

  // Add glitch flicker
  hologramImg.classList.add("glitch");
  hologramName.classList.add("glitch");

  setTimeout(() => {
    hologramImg.src = `aliens/${alien.slug}.png`;
    hologramImg.alt = alien.name;
    hologramName.textContent = alien.name;

    hologramImg.classList.remove("glitch");
    hologramName.classList.remove("glitch");
  }, 200);
}

function nextAlien() {
  currentAlien = (currentAlien + 1) % aliens.length;
  updateHologram(currentAlien);
}

function prevAlien() {
  currentAlien = (currentAlien - 1 + aliens.length) % aliens.length;
  updateHologram(currentAlien);
}

function transform() {
  const alien = aliens[currentAlien];
  statusText.textContent = `Transforming into ${alien.name}...`;

  // Flash effect
  flash.classList.add("flash--active");
  setTimeout(() => flash.classList.remove("flash--active"), 250);

  // Clear status after transformation
  setTimeout(() => {
    statusText.textContent = `You are now ${alien.name}!`;
  }, 600);
}

// ===== Event Listeners =====
nextBtn.addEventListener("click", nextAlien);
prevBtn.addEventListener("click", prevAlien);
dial.addEventListener("click", nextAlien);
transformBtn.addEventListener("click", transform);

// ===== Initialize =====
updateHologram(currentAlien);
