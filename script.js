// ==========================
// OMNITRIX SCRIPT
// ==========================

// --- Elements ---
const holoImage   = document.getElementById("holoImage");
const holoName    = document.getElementById("holoName");
const statusText  = document.getElementById("statusText");
const flash       = document.getElementById("flash");

const prevBtn     = document.getElementById("prevBtn");
const nextBtn     = document.getElementById("nextBtn");
const transformBtn= document.getElementById("transformBtn");
const dial        = document.getElementById("dial");

// --- Sounds ---
const sfxRotate   = document.getElementById("sfxRotate");
const sfxSelect   = document.getElementById("sfxSelect");
const sfxTransform= document.getElementById("sfxTransform");

// --- Alien Data ---
const aliens = [
  { name: "Heatblast",    slug: "heatblast" },
  { name: "Wildmutt",     slug: "wildmutt" },
  { name: "Diamondhead",  slug: "diamondhead" },
  { name: "XLR8",         slug: "xlr8" },
  { name: "Grey Matter",  slug: "grey-matter" },
  { name: "Four Arms",    slug: "four-arms" },
  { name: "Stinkfly",     slug: "stinkfly" },
  { name: "Ripjaws",      slug: "ripjaws" },
  { name: "Upgrade",      slug: "upgrade" },
  { name: "Ghostfreak",   slug: "ghostfreak" },
  { name: "Cannonbolt",   slug: "cannonbolt" },
  { name: "Wildvine",     slug: "wildvine" },
  { name: "Spitter",      slug: "spitter" },
  { name: "Blitzwolfer",  slug: "blitzwolfer" },
  { name: "Snare-oh",     slug: "snare-oh" },
  { name: "Frankenstrike",slug: "frankenstrike" },
  { name: "Upchuck",      slug: "upchuck" },
  { name: "Ditto",        slug: "ditto" },
  { name: "Eye Guy",      slug: "eye-guy" },
  { name: "Way Big",      slug: "way-big" }
];

let currentIndex = 0;
let dialRotation = 0;

// --- Functions ---
function updateHologram() {
  const alien = aliens[currentIndex];
  holoImage.src = `aliens/${alien.slug}.png`;
  holoImage.alt = `${alien.name} hologram`;
  holoName.textContent = alien.name;
}

function rotateDial(direction) {
  // Rotate index
  if (direction === "next") {
    currentIndex = (currentIndex + 1) % aliens.length;
    dialRotation += 45;
  } else {
    currentIndex = (currentIndex - 1 + aliens.length) % aliens.length;
    dialRotation -= 45;
  }

  // Spin animation
  dial.style.transform = `rotate(${dialRotation}deg)`;
  updateHologram();

  // Play sound
  sfxRotate.currentTime = 0;
  sfxRotate.play();
}

function transform() {
  const alien = aliens[currentIndex];

  // Flash effect
  flash.classList.add("flash--active");
  setTimeout(() => flash.classList.remove("flash--active"), 600);

  // Update status
  statusText.textContent = `Transforming into ${alien.name}...`;
  setTimeout(() => {
    statusText.textContent = `Transformed: ${alien.name}`;
  }, 700);

  // Play sound
  sfxTransform.currentTime = 0;
  sfxTransform.play();

  // Visual pulse on hologram
  holoImage.classList.add("pulse");
  setTimeout(() => holoImage.classList.remove("pulse"), 1000);
}

// --- Event Listeners ---
prevBtn.addEventListener("click", () => rotateDial("prev"));
nextBtn.addEventListener("click", () => rotateDial("next"));
transformBtn.addEventListener("click", transform);

// Dial itself clickable for transform
dial.addEventListener("click", transform);

// --- Init ---
updateHologram();
