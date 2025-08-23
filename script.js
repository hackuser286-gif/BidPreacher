// ------- Data -------
const aliens = [
  { name: "Heatblast",    img: "aliens/heatblast.png" },
  { name: "Wildmutt",     img: "aliens/wildmutt.png" },
  { name: "Diamondhead",  img: "aliens/diamondhead.png" },
  { name: "XLR8",         img: "aliens/xlr8.png" },
  { name: "Grey Matter",  img: "aliens/greymatter.png" },
  { name: "Four Arms",    img: "aliens/fourarms.png" },
  { name: "Stinkfly",     img: "aliens/stinkfly.png" },
  { name: "Ripjaws",      img: "aliens/ripjaws.png" },
  { name: "Upgrade",      img: "aliens/upgrade.png" },
  { name: "Ghostfreak",   img: "aliens/ghostfreak.png" },
  { name: "Cannonbolt",   img: "aliens/cannonbolt.png" },
  { name: "Wildvine",     img: "aliens/wildvine.png" },
  { name: "Spitter",      img: "aliens/spitter.png" },
  { name: "Blitzwolfer",  img: "aliens/blitzwolfer.png" },
  { name: "Snare-oh",     img: "aliens/snareoh.png" },
  { name: "Frankenstrike",img: "aliens/frankenstrike.png" },
  { name: "Upchuck",      img: "aliens/upchuck.png" },
  { name: "Ditto",        img: "aliens/ditto.png" },
  { name: "Eye Guy",      img: "aliens/eyeguy.png" },
  { name: "Way Big",      img: "aliens/waybig.png" }
];

// ------- Elements -------
const omnitrix   = document.getElementById("omnitrix");
const dial       = document.getElementById("dial");
const dialImage  = document.getElementById("dialImage");
const hologramEl = document.getElementById("hologram");
const holoImage  = document.getElementById("holoImage");
const holoName   = document.getElementById("holoName");
const flash      = document.getElementById("flash");
const statusText = document.getElementById("statusText");

// ------- State -------
let selecting = false;     // hologram visible / choosing
let transformed = false;   // currently alien
let angle = 0;             // visual rotation
let currentIndex = 0;

const STEP = 360 / aliens.length; // degrees per alien
const ZERO_OFFSET = 0; // tweak if your dial art has a different "zero"

// ------- Helpers -------
function setStatus(msg){ statusText.textContent = msg; }

function clampDeg(a){
  a = a % 360;
  return a < 0 ? a + 360 : a;
}

function angleToIndex(a){
  // Convert angle to nearest alien index
  const d = clampDeg(a - ZERO_OFFSET);
  return Math.round(d / STEP) % aliens.length;
}

function snapAngleForIndex(i){
  return clampDeg(i * STEP + ZERO_OFFSET);
}

function updateHologram(i){
  const al = aliens[i];
  holoImage.src = al.img;
  holoName.textContent = al.name;
}

function showFlash(color){ // "green" or "red"
  flash.classList.remove("green","red","show");
  flash.classList.add(color);
  // force reflow for restart
  void flash.offsetWidth;
  flash.classList.add("show");
  setTimeout(()=>flash.classList.remove("show"), 320);
}

// ------- Interaction Logic -------
function enterSelecting(){
  if (selecting || transformed) return;
  selecting = true;
  omnitrix.classList.add("selecting");
  hologramEl.style.display = "grid";
  updateHologram(currentIndex);
  setStatus("Rotate the dial to choose");
}

function tryToggleTransform(){
  if (!selecting && !transformed){
    // First tap just enters selecting (no transform)
    enterSelecting();
    return;
  }
  if (!transformed){
    // Transform into alien
    transformed = true;
    omnitrix.classList.remove("selecting");
    omnitrix.classList.add("transformed");
    showFlash("green");
    setStatus(`Transformed into ${aliens[currentIndex].name}`);
  }else{
    // Revert back to normal
    transformed = false;
    omnitrix.classList.remove("transformed");
    selecting = false;
    hologramEl.style.display = "none";
    showFlash("red");
    setStatus("Back to human. Tap to begin");
  }
}

// Drag rotation (Pointer Events)
let dragging = false;
let moved = false;

dial.addEventListener("pointerdown", (e)=>{
  if (transformed) return; // cannot rotate when transformed
  dragging = true;
  moved = false;
  dial.setPointerCapture(e.pointerId);

  // If this is the first interaction, enter selecting mode
  if (!selecting) enterSelecting();
});

dial.addEventListener("pointermove", (e)=>{
  if (!dragging || transformed) return;

  const rect = dial.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top  + rect.height/2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  // atan2 gives radians from +X axis; convert to deg and rotate so 0° is to the right.
  let deg = Math.atan2(dy, dx) * (180/Math.PI); // -180..180
  deg = clampDeg(deg); // 0..360

  // Snap the visual to nearest segment smoothly
  const idx = angleToIndex(deg);
  const snapped = snapAngleForIndex(idx);

  if (idx !== currentIndex){
    currentIndex = idx;
    updateHologram(currentIndex);
    setStatus(`Selected: ${aliens[currentIndex].name}`);
  }

  angle = snapped;
  dialImage.style.transform = `rotate(${angle}deg)`;
  moved = true;
});

dial.addEventListener("pointerup", (e)=>{
  if (!dragging) return;
  dragging = false;
  dial.releasePointerCapture(e.pointerId);

  // If user didn't move, treat as a tap (toggle transform/enter select)
  if (!moved){
    tryToggleTransform();
  }
});

// Keyboard helpers (optional)
document.addEventListener("keydown",(e)=>{
  if (e.key === "Enter") { tryToggleTransform(); }
  if (transformed) return;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft"){
    if (!selecting) enterSelecting();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    currentIndex = (currentIndex + dir + aliens.length) % aliens.length;
    angle = snapAngleForIndex(currentIndex);
    dialImage.style.transform = `rotate(${angle}deg)`;
    updateHologram(currentIndex);
    setStatus(`Selected: ${aliens[currentIndex].name}`);
  }
});

// ------- Init -------
hologramEl.style.display = "none";
setStatus("Tap the dial to begin");
dialImage.style.transform = `rotate(${snapAngleForIndex(currentIndex)}deg)`;
