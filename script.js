// ---------- Elements ----------
const holoImage    = document.getElementById("holoImage");
const holoName     = document.getElementById("holoName");
const statusText   = document.getElementById("statusText");
const flash        = document.getElementById("flash");

const dial         = document.getElementById("dial");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");
const transformBtn = document.getElementById("transformBtn");

const ring         = document.getElementById("alienRing");
const ringItems    = Array.from(ring.querySelectorAll(".alien"));

// (Optional) sounds — safe to call even if files missing
const sfxRotate    = document.getElementById("sfxRotate");
const sfxSelect    = document.getElementById("sfxSelect");
const sfxTransform = document.getElementById("sfxTransform");

const playSafe = (el) => {
  if (!el || typeof el.play !== "function") return;
  try { el.currentTime = 0; el.play().catch(()=>{}); } catch {}
};

// ---------- Data ----------
const aliens = ringItems.map(li => ({
  name: li.dataset.name,
  slug: li.dataset.slug
}));

const STEP_DEG = 360 / aliens.length;  // 18° for 20 aliens

let currentIndex = 0;
let dialAngle    = 0;
let dragging     = false;
let startAngle   = 0;
let baseAngle    = 0;

// Fallback placeholder (used if alien PNG is missing)
const placeholderDataURL = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 100 100'>
    <rect width='100' height='100' rx='12' fill='#0c1f17'/>
    <circle cx='50' cy='50' r='28' fill='none' stroke='#27ff6f' stroke-width='2'/>
    <path d='M30,28 A20,20 0 0,0 70,28 L60,38 L40,38 Z
             M40,62 L60,62 70,72 A20,20 0 0,1 30,72 Z' fill='#27ff6f'/>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
})();

// ---------- Layout: position ring icons ----------
function layoutRing() {
  const rect = dial.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top  + rect.height/2;

  // radius relative to dial size
  const radius = rect.width * 0.9;

  ringItems.forEach((li, i) => {
    const theta = (i * STEP_DEG - 90) * Math.PI/180; // start top
    const x = cx + Math.cos(theta) * radius;
    const y = cy + Math.sin(theta) * radius;

    // convert page coords to ring (which is absolute + inset 0)
    const ringRect = ring.getBoundingClientRect();
    const rx = x - ringRect.left;
    const ry = y - ringRect.top;

    li.style.left = rx + "px";
    li.style.top  = ry + "px";

    // set thumbnail image if available
    const url = `aliens/${aliens[i].slug}.png`;
    // use ::after background via style variable
    li.style.setProperty("--thumb", `url("${url}")`);
    // also set it directly for broader support
    li.style.setProperty("background-image", "none");
    li.style.setProperty("background", getComputedStyle(li).background); // keep background

    // inject <img> as a fallback visual
    if (!li.querySelector("img")) {
      const img = document.createElement("img");
      img.alt = `${aliens[i].name} icon`;
      img.style.position = "absolute";
      img.style.inset = "12%";
      img.style.width = "76%";
      img.style.height = "76%";
      img.style.objectFit = "contain";
      img.style.filter = "drop-shadow(0 0 .4rem rgba(39,255,111,.65)) saturate(1.1)";
      img.src = url;
      img.onerror = () => { img.src = placeholderDataURL; };
      li.appendChild(img);
    }
  });
}

window.addEventListener("resize", () => {
  // Re-layout when viewport changes
  layoutRing();
});

// ---------- State updates ----------
function setIndex(idx, reason = "rotate") {
  const total = aliens.length;
  currentIndex = ((idx % total) + total) % total;
  dialAngle = Math.round(currentIndex * STEP_DEG);

  // rotate dial
  dial.style.transform = `rotate(${dialAngle}deg)`;

  // update hologram + name
  const a = aliens[currentIndex];
  holoName.textContent = a.name;
  holoImage.alt = `${a.name} hologram`;
  holoImage.src = `aliens/${a.slug}.png`;
  holoImage.onerror = () => { holoImage.src = placeholderDataURL; };

  // ring highlight
  ringItems.forEach((li, i) => li.classList.toggle("is-active", i === currentIndex));

  // sounds
  if (reason === "rotate") playSafe(sfxRotate);
  if (reason === "snap")   playSafe(sfxSelect);

  // status
  statusText.textContent = `Selected: ${a.name}`;
}

function stepNext(){ setIndex(currentIndex + 1, "rotate"); }
function stepPrev(){ setIndex(currentIndex - 1, "rotate"); }

// ---------- Drag / rotate dial ----------
function angleFromEvent(e){
  const r = dial.getBoundingClientRect();
  const cx = r.left + r.width/2;
  const cy = r.top  + r.height/2;
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - cx;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - cy;
  return Math.atan2(y, x) * 180/Math.PI; // -180..180
}

function onDown(e){
  e.preventDefault();
  dragging = true;
  dial.classList.add("is-rotating");
  startAngle = angleFromEvent(e);
  baseAngle  = dialAngle;
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, {passive:false});
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);
}
function onMove(e){
  if(!dragging) return;
  e.preventDefault();
  const a = angleFromEvent(e);
  const delta = a - startAngle; // degrees
  const liveAngle = baseAngle + delta;
  // live visual rotation
  dial.style.transform = `rotate(${liveAngle}deg)`;
  // pick nearest index (snap preview)
  const idx = Math.round((((liveAngle % 360) + 360) % 360) / STEP_DEG) % aliens.length;
  if (idx !== currentIndex){
    currentIndex = idx;
    const aData = aliens[currentIndex];
    holoName.textContent = aData.name;
    holoImage.alt = `${aData.name} hologram`;
    holoImage.src = `aliens/${aData.slug}.png`;
    holoImage.onerror = () => { holoImage.src = placeholderDataURL; };
    ringItems.forEach((li, i) => li.classList.toggle("is-active", i === currentIndex));
    playSafe(sfxRotate);
  }
}
function onUp(){
  if(!dragging) return;
  dragging = false;
  dial.classList.remove("is-rotating");
  // snap to exact step
  setIndex(currentIndex, "snap");
  window.removeEventListener("mousemove", onMove);
  window.removeEventListener("touchmove", onMove);
  window.removeEventListener("mouseup", onUp);
  window.removeEventListener("touchend", onUp);
}

// Clicking the dial = transform
dial.addEventListener("click", (e)=>{
  // ignore click that ends a drag (small movements will still fire click)
  if (dragging) return;
  doTransform();
});

// Pointer handlers
dial.addEventListener("mousedown", onDown);
dial.addEventListener("touchstart", onDown, {passive:false});

// Buttons
prevBtn.addEventListener("click", stepPrev);
nextBtn.addEventListener("click", stepNext);
transformBtn.addEventListener("click", ()=>doTransform());

// Keyboard (Left/Right/Enter)
window.addEventListener("keydown", (e)=>{
  if (e.key === "ArrowLeft")  stepPrev();
  if (e.key === "ArrowRight") stepNext();
  if (e.key === "Enter")      doTransform();
});

// ---------- Transform effect ----------
function doTransform(){
  const a = aliens[currentIndex];
  document.body.classList.add("is-transforming");
  flash.classList.add("is-on");
  statusText.textContent = `Transforming into ${a.name}...`;

  playSafe(sfxTransform);

  // pulse the hologram
  holoImage.style.transition = "transform .3s ease";
  holoImage.style.transform = "scale(1.08)";
  setTimeout(()=>{ holoImage.style.transform = "scale(1)"; }, 300);

  // cleanup
  setTimeout(()=>{
    flash.classList.remove("is-on");
    document.body.classList.remove("is-transforming");
    statusText.textContent = `Transformed: ${a.name}`;
  }, 650);
}

// ---------- Init ----------
function init(){
  // prepare ring thumbs & layout
  layoutRing();
  // initial selection
  setIndex(0, "snap");
}
document.addEventListener("DOMContentLoaded", init);
