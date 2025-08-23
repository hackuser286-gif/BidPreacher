/* =========================
   ULTIMATE OMNITRIX SCRIPT
   ========================= */

/* --- Data --- */
const ALIENS = [
  { name: "Heatblast",     img: "aliens/heatblast.png" },
  { name: "Wildmutt",      img: "aliens/wildmutt.png" },
  { name: "Diamondhead",   img: "aliens/diamondhead.png" },
  { name: "XLR8",          img: "aliens/xlr8.png" },
  { name: "Grey Matter",   img: "aliens/greymatter.png" },
  { name: "Four Arms",     img: "aliens/fourarms.png" },
  { name: "Stinkfly",      img: "aliens/stinkfly.png" },
  { name: "Ripjaws",       img: "aliens/ripjaws.png" },
  { name: "Upgrade",       img: "aliens/upgrade.png" },
  { name: "Ghostfreak",    img: "aliens/ghostfreak.png" },
  { name: "Cannonbolt",    img: "aliens/cannonbolt.png" },
  { name: "Wildvine",      img: "aliens/wildvine.png" },
  { name: "Spitter",       img: "aliens/spitter.png" },
  { name: "Blitzwolfer",   img: "aliens/blitzwolfer.png" },
  { name: "Snare-oh",      img: "aliens/snareoh.png" },
  { name: "Frankenstrike", img: "aliens/frankenstrike.png" },
  { name: "Upchuck",       img: "aliens/upchuck.png" },
  { name: "Ditto",         img: "aliens/ditto.png" },
  { name: "Eye Guy",       img: "aliens/eyeguy.png" },
  { name: "Way Big",       img: "aliens/waybig.png" },
];

/* --- Elements --- */
const omnitrix     = document.getElementById("omnitrix");
const dial         = document.getElementById("dial");
const dialImage    = document.getElementById("dialImage");
const dialFallback = document.getElementById("dialFallback");
const holoWrap     = document.getElementById("holoOnDial");
const holoImage    = document.getElementById("holoImage");
const holoName     = document.getElementById("holoName");
const statusText   = document.getElementById("statusText");
const flash        = document.getElementById("flash");
const scanSweep    = document.getElementById("scanSweep");
const staticFx     = document.getElementById("staticFx");

const hudState     = document.getElementById("hudState");
const ringFg       = document.getElementById("ringFg");
const percentText  = document.getElementById("percentText");
const cooldownText = document.getElementById("cooldownText");

/* Sounds (optional) */
const sClick     = document.getElementById("sClick");
const sRotate    = document.getElementById("sRotate");
const sSelect    = document.getElementById("sSelect");
const sTransform = document.getElementById("sTransform");
const sRevert    = document.getElementById("sRevert");
const sError     = document.getElementById("sError");
const sLow       = document.getElementById("sLow");
const sGlitch    = document.getElementById("sGlitch");

/* --- Config --- */
const STEP_DEG         = 360 / ALIENS.length;
const ZERO_DEG         = 0;            // adjust if your dial art needs offset
const USE_SNAP         = true;
const ROTATE_SOUND_EVERY_STEPS = 1;    // play rotate sfx every N index changes
const TRANSFORM_COST_PER_SEC   = 12;   // % per second while transformed
const RECHARGE_PER_SEC         = 30;   // % per second while recharging
const COOLDOWN_SEC             = 5;    // lockout time after revert/auto-revert
const MIN_CHARGE_TO_TRANSFORM  = 25;   // must have at least this much to transform
const GLITCH_CHANCE_SELECT     = 0.06; // per second while selecting
const GLITCH_CHANCE_LOW        = 0.15; // per second when charge < 20%
const TICK_MS                  = 1000/30; // 30fps internal timer

/* --- State --- */
let appState = "idle"; // "idle" | "selecting" | "transformed" | "cooldown"
let index = 0;          // selected alien index
let angle = 0;          // snapped angle visual
let dragging = false;
let lastRotateSoundIdx = 0;

let charge = 100;       // 0..100
let cooldownRemain = 0; // seconds

/* --- Helpers --- */
const clamp360 = d => (d%=360, d<0?d+360:d);
const idxToAngle = i => clamp360(i * STEP_DEG + ZERO_DEG);
const angleToIdx = a => {
  const d = clamp360(a - ZERO_DEG);
  return Math.round(d / STEP_DEG) % ALIENS.length;
};
const play = el => el && el.play && el.play().catch(()=>{});
const setStatus = t => { statusText.textContent = t; };
const setHudState = t => { hudState.textContent = t.toUpperCase(); };

/* dial rotation applied to PNG or fallback */
function applyDialRotation(deg){
  if (dialImage && dialImage.style.display !== "none"){
    dialImage.style.transform = `rotate(${deg}deg)`;
  } else {
    dial.style.transform = `rotate(${deg}deg)`;
  }
}

function showHolo(){ holoWrap.style.display = "grid"; holoWrap.setAttribute("aria-hidden","false"); }
function hideHolo(){ holoWrap.style.display = "none"; holoWrap.setAttribute("aria-hidden","true"); }

function updateHolo(i){
  const a = ALIENS[i];
  holoImage.src = a.img;
  holoName.textContent = a.name;
}

function showFlash(kind){
  flash.classList.remove("show","red");
  if (kind === "red") flash.classList.add("red");
  void flash.offsetWidth;
  flash.classList.add("show");
  setTimeout(()=>flash.classList.remove("show"), 340);
}

function setLowBatteryVisuals(on){
  document.body.classList.toggle("low", !!on);
}

function updateEnergyUI(){
  // ring uses dashoffset: 0..100
  const off = 100 - Math.max(0, Math.min(100, charge));
  ringFg.style.strokeDashoffset = off;
  percentText.textContent = `${Math.round(charge)}%`;
  setLowBatteryVisuals(charge < 20);
}

function setCooldownUI(sec){
  cooldownText.textContent = sec > 0 ? `COOLDOWN: ${sec.toFixed(1)}s` : "";
}

/* --- State transitions --- */
function toIdle(){
  appState = "idle";
  omnitrix.classList.remove("selecting","transformed","shake");
  hideHolo();
  setHudState("IDLE");
  setStatus("Tap the dial to begin");
  dial.setAttribute("aria-pressed", "false");
  staticFx.style.opacity = 0;
}

function toSelecting(){
  if (appState === "cooldown"){
    play(sError);
    omnitrix.classList.add("shake");
    setTimeout(()=>omnitrix.classList.remove("shake"), 400);
    return;
  }
  appState = "selecting";
  omnitrix.classList.add("selecting");
  omnitrix.classList.remove("transformed");
  showHolo();
  updateHolo(index);
  setHudState("SELECT");
  setStatus("Rotate/scroll to choose. Tap to transform");
  dial.setAttribute("aria-pressed", "true");
  play(sClick);
}

function toTransformed(){
  if (charge < MIN_CHARGE_TO_TRANSFORM){
    play(sError);
    setStatus(`Insufficient charge (${Math.floor(charge)}%). Rotate while recharging.`);
    omnitrix.classList.add("shake");
    setTimeout(()=>omnitrix.classList.remove("shake"), 400);
    return;
  }
  appState = "transformed";
  omnitrix.classList.remove("selecting");
  omnitrix.classList.add("transformed");
  hideHolo(); // dial-only while transformed
  showFlash("green");
  setHudState("ALIEN");
  setStatus(`Transformed: ${ALIENS[index].name}`);
  play(sTransform);
}

function toCooldown(seconds){
  appState = "cooldown";
  cooldownRemain = seconds;
  setHudState("COOLDOWN");
  setStatus("Cooling down…");
  setCooldownUI(cooldownRemain);
}

function revertToHuman(auto=false){
  // enter cooldown after revert or auto-revert
  showFlash("red");
  setHudState("IDLE");
  setStatus(auto ? "Auto-revert: energy depleted" : "Back to human");
  play(sRevert);
  hideHolo();
  toCooldown(COOLDOWN_SEC);
}

/* --- Input: Tap / Click --- */
dial.addEventListener("click", ()=>{
  if (appState === "idle")        return toSelecting();
  if (appState === "selecting")   return toTransformed();
  if (appState === "transformed") return revertToHuman(false);
  if (appState === "cooldown"){
    play(sError);
    omnitrix.classList.add("shake");
    setTimeout(()=>omnitrix.classList.remove("shake"), 400);
  }
});

/* --- Input: Drag rotation --- */
let dragging = false;

dial.addEventListener("pointerdown", e=>{
  if (appState === "transformed") return; // locked
  dragging = true;
  dial.setPointerCapture(e.pointerId);
  if (appState === "idle") toSelecting(); // first interaction
});

dial.addEventListener("pointermove", e=>{
  if (!dragging || appState !== "selecting") return;
  const r  = dial.getBoundingClientRect();
  const cx = r.left + r.width/2;
  const cy = r.top  + r.height/2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  let deg = Math.atan2(dy, dx) * (180/Math.PI);
  deg = clamp360(deg);

  const newIdx = angleToIdx(deg);
  if (newIdx !== index){
    index = newIdx;
    updateHolo(index);
    setStatus(`Selected: ${ALIENS[index].name}`);
    // play rotate sound occasionally
    if (Math.abs(index - lastRotateSoundIdx) >= ROTATE_SOUND_EVERY_STEPS){
      play(sRotate);
      lastRotateSoundIdx = index;
    }
  }
  angle = USE_SNAP ? idxToAngle(index) : deg;
  applyDialRotation(angle);
});

dial.addEventListener("pointerup", e=>{
  if (!dragging) return;
  dragging = false;
  dial.releasePointerCapture(e.pointerId);
});

/* --- Input: Scroll --- */
dial.addEventListener("wheel", e=>{
  if (appState !== "selecting") return;
  e.preventDefault();
  const dir = e.deltaY > 0 ? 1 : -1;
  index = (index + dir + ALIENS.length) % ALIENS.length;
  updateHolo(index);
  setStatus(`Selected: ${ALIENS[index].name}`);
  angle = idxToAngle(index);
  applyDialRotation(angle);
  play(sRotate);
}, { passive:false });

/* --- Input: Keyboard --- */
document.addEventListener("keydown", e=>{
  if (e.key === "Enter"){
    if (appState === "idle") toSelecting();
    else if (appState === "selecting") toTransformed();
    else if (appState === "transformed") revertToHuman(false);
    return;
  }
  if (appState !== "selecting") return;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft"){
    const dir = e.key === "ArrowRight" ? 1 : -1;
    index = (index + dir + ALIENS.length) % ALIENS.length;
    updateHolo(index);
    setStatus(`Selected: ${ALIENS[index].name}`);
    angle = idxToAngle(index);
    applyDialRotation(angle);
    play(sRotate);
  }
});

/* --- Engine tick: charge, cooldown, glitches --- */
let lastTime = performance.now();
function tick(now){
  const dt = Math.max(0, now - lastTime) / 1000; // seconds
  lastTime = now;

  // Charge system
  if (appState === "transformed"){
    charge -= TRANSFORM_COST_PER_SEC * dt;
    if (charge <= 0){
      charge = 0;
      revertToHuman(true); // auto-revert
    }
  } else if (appState === "idle" || appState === "selecting"){
    if (charge < 100){
      charge = Math.min(100, charge + RECHARGE_PER_SEC * dt);
    }
  } else if (appState === "cooldown"){
    cooldownRemain -= dt;
    setCooldownUI(Math.max(0, cooldownRemain));
    if (cooldownRemain <= 0){
      cooldownRemain = 0;
      setCooldownUI(0);
      toIdle();
    }
  }

  updateEnergyUI();

  // Low battery warning pulse
  if (charge < 20 && (appState === "selecting" || appState === "idle")){
    // occasionally play low battery
    if (Math.random() < 0.02) play(sLow);
  }

  // Glitch effects chance
  const glitchChance =
    (appState === "selecting" ? GLITCH_CHANCE_SELECT : 0) +
    (charge < 20 ? GLITCH_CHANCE_LOW : 0);

  if (Math.random() < glitchChance * dt * 10){
    triggerGlitch();
  }

  requestAnimationFrame(tick);
}

/* --- Glitch FX --- */
let glitchTimeout;
function triggerGlitch(){
  // small static burst + shake + sweep speed change
  staticFx.style.opacity = 0.35;
  omnitrix.classList.add("shake");
  play(sGlitch);
  clearTimeout(glitchTimeout);
  glitchTimeout = setTimeout(()=>{
    staticFx.style.opacity = 0;
    omnitrix.classList.remove("shake");
  }, 220);
}

/* --- Init --- */
function init(){
  toIdle();
  angle = idxToAngle(index);
  applyDialRotation(angle);
  updateHolo(index);
  updateEnergyUI();
  setCooldownUI(0);
  requestAnimationFrame(tick);
}
init();
