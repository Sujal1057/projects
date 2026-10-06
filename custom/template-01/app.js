import { PixelCamera, PALETTES } from "./pixel-camera.js";

/* =========================================================================
   Config — tweak freely
   ========================================================================= */
const CONFIG = {
  /** Fallback heading. The <h1 id="heading"> text wins, and `?title=` wins over both. */
  heading: "Story of my life:",
  defaultPalette: "toon",
  countdownFrom: 3,
  countdownStepMs: 800,
  exportTargetWidth: 1080, // px width of the saved PNG photo area (approx.)
  fileName: "kanverse-pixel",
  sounds: true,
};

const ERRORS = {
  denied: {
    title: "ACCESS DENIED",
    msg: "Please allow camera access to enter pixel mode.",
    hint: "Tap the camera / lock icon in the address bar, allow Camera, then retry.",
  },
  notfound: {
    title: "CAMERA NOT FOUND",
    msg: "No camera detected on this device.",
    hint: "Plug in a webcam or try another device.",
  },
  unavailable: {
    title: "CAMERA BUSY",
    msg: "Your camera is unavailable right now.",
    hint: "Close other apps or tabs using the camera, then retry.",
  },
  unsupported: {
    title: "NO SIGNAL",
    msg: "This browser can't access the camera.",
    hint: "Try the latest Chrome, Safari, Firefox or Edge.",
  },
  insecure: {
    title: "INSECURE LINK",
    msg: "Camera needs a secure (https) connection.",
    hint: "Open this page over https:// or on localhost.",
  },
};

/* =========================================================================
   DOM
   ========================================================================= */
const $ = (id) => document.getElementById(id);
const app = $("app");
const els = {
  heading: $("heading"),
  video: $("camera-video"),
  canvas: $("camera-canvas"),
  screen: $("screen"),
  flash: $("screen-flash"),
  countdown: $("countdown"),
  status: $("status"),
  hudCam: $("hud-cam"),
  hudRes: $("hud-res"),
  hudMode: $("hud-mode"),
  hudShotMode: $("hud-shot-mode"),
  hudCapText: $("hud-cap-text"),
  modeLabel: $("mode-label"),
  shotModeBtn: $("btn-shot-mode"),
  shotModeLabel: $("shot-mode-label"),
  captureLabel: $("capture-label"),
  stepRetake: $("btn-step-retake"),
  stepRetakeLabel: $("step-retake-label"),
  stepNext: $("btn-step-next"),
  stepNextLabel: $("step-next-label"),
  retakeLabel: $("retake-label"),
  saveLabel: $("save-label"),
  errTitle: $("error-title"),
  errMsg: $("error-msg"),
  errHint: $("error-hint"),
  start: $("btn-start"),
  retry: $("btn-retry"),
  capture: $("btn-capture"),
  switchCam: $("btn-switch"),
  mode: $("btn-mode"),
  retake: $("btn-retake"),
  save: $("btn-save"),
  share: $("btn-share"),
};

const setState = (s) => {
  app.dataset.state = s;
};
const announce = (msg) => {
  els.status.textContent = msg;
};

/* =========================================================================
   Heading (typewriter)
   ========================================================================= */
const headingText = (() => {
  const q = new URLSearchParams(location.search).get("title");
  return (q && q.trim().slice(0, 80)) || els.heading.textContent.trim() || CONFIG.heading;
})();

function typeHeading(text) {
  const el = els.heading;
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const span = document.createElement("span");
  span.setAttribute("aria-hidden", "true");
  const cursor = document.createElement("i");
  cursor.className = "title__cursor";
  cursor.setAttribute("aria-hidden", "true");
  el.append(span, cursor);

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    span.textContent = text;
    return;
  }
  let i = 0;
  const tick = () => {
    span.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, 55 + Math.random() * 60);
  };
  setTimeout(tick, 300);
}

/* =========================================================================
   Screen grain texture
   ========================================================================= */
function makeNoise() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d");
  const img = x.createImageData(64, 64);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  els.screen.style.setProperty("--noise", `url(${c.toDataURL()})`);
}

/* =========================================================================
   8-bit bleeps (WebAudio)
   ========================================================================= */
let audioCtx = null;
function beep(freq = 440, dur = 0.08, type = "square", vol = 0.04) {
  if (!CONFIG.sounds) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.setValueAtTime(vol, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + dur);
  } catch {
    /* audio is optional */
  }
}

/* =========================================================================
   Camera & State
   ========================================================================= */
let palette = CONFIG.defaultPalette;
try {
  const saved = localStorage.getItem("pixl86.palette");
  if (saved && PALETTES[saved]) palette = saved;
} catch {
  /* storage blocked */
}

let shotMode = "single"; // "single" | "strip"
let stripFrames = [];
let countdownTimer = 0;
let capturedCanvas = null; // single canvas or array of 3 canvas frames
let printBlob = null;
let printPromise = null;

const camera = new PixelCamera({
  video: els.video,
  canvas: els.canvas,
  palette,
  onStateChange(state) {
    if (state === "loading" && app.dataset.state !== "captured" && app.dataset.state !== "strip-step") {
      setState("loading");
    }
    if (state === "live" && app.dataset.state !== "captured" && app.dataset.state !== "countdown" && app.dataset.state !== "strip-step") {
      setState("live");
      announce("Camera on. Pixel mode active.");
    }
  },
  onError({ code, error }) {
    if (error) console.warn("[PIXL-86] camera error:", error);
    cancelCountdown();
    showError(code);
  },
  onInfo({ facing, canSwitch, width, height }) {
    els.hudCam.textContent = facing === "environment" ? "REAR" : "FRONT";
    els.hudRes.textContent = `${width}x${height}`;
    els.switchCam.classList.toggle("is-hidden-soft", !canSwitch);
    els.switchCam.setAttribute("aria-hidden", String(!canSwitch));
    els.switchCam.tabIndex = canSwitch ? 0 : -1;
  },
});

function showError(code) {
  const e = ERRORS[code] || ERRORS.unavailable;
  els.errTitle.textContent = e.title;
  els.errMsg.textContent = e.msg;
  els.errHint.textContent = e.hint;
  setState("error");
  announce(`${e.title}. ${e.msg}`);
}

function applyPalette(name) {
  palette = name;
  camera.setPalette(name);
  const p = PALETTES[name];
  els.modeLabel.textContent = p.label;
  els.hudMode.textContent = p.label;
  p.swatch.forEach((c, i) => els.mode.style.setProperty(`--sw${i + 1}`, c));
  try {
    localStorage.setItem("pixl86.palette", name);
  } catch {
    /* ignore */
  }
}

function toggleShotMode() {
  shotMode = shotMode === "single" ? "strip" : "single";
  stripFrames = [];
  updateShotModeUI();
  beep(480, 0.05);
}

function updateShotModeUI() {
  const isStrip = shotMode === "strip";
  els.shotModeLabel.textContent = isStrip ? "3x STRIP" : "1-SHOT";
  els.hudShotMode.textContent = isStrip ? "3x STRIP" : "1-SHOT";
  if (isStrip) {
    els.captureLabel.textContent = stripFrames.length > 0 ? `SHOT ${stripFrames.length + 1}` : "START STRIP";
  } else {
    els.captureLabel.textContent = "CAPTURE";
  }
}

async function startCamera() {
  await camera.start({ facing: "user" });
}

/* =========================================================================
   Countdown → flash → freeze / photo strip steps
   ========================================================================= */
function cancelCountdown() {
  clearTimeout(countdownTimer);
  els.countdown.textContent = "";
}

function showDigit(n) {
  const s = document.createElement("span");
  s.textContent = n;
  els.countdown.replaceChildren(s);
}

function capture() {
  if (app.dataset.state !== "live") return;
  setState("countdown");
  let n = CONFIG.countdownFrom;

  const step = () => {
    if (app.dataset.state !== "countdown") return;
    if (n > 0) {
      showDigit(n);
      announce(String(n));
      beep(520, 0.09);
      n--;
      countdownTimer = setTimeout(step, CONFIG.countdownStepMs);
      return;
    }
    els.countdown.textContent = "";
    const frame = camera.freeze(); // capture pixelated frame & keep it rendered on canvas
    flash();
    beep(1046, 0.05);
    setTimeout(() => beep(1568, 0.12), 60);

    if (shotMode === "strip") {
      stripFrames.push(frame);
      if (stripFrames.length < 3) {
        // Inter-shot confirmation step — screen canvas stays frozen on this frame!
        els.stepRetakeLabel.textContent = `RETAKE SHOT ${stripFrames.length}`;
        els.stepNextLabel.textContent = `CONFIRM & SHOT ${stripFrames.length + 1}`;
        if (els.hudCapText) {
          els.hudCapText.textContent = `SHOT ${stripFrames.length}/3 CAPTURED`;
        }
        setState("strip-step");
        announce(`Shot ${stripFrames.length} of 3 captured. Look at the screen to confirm or retake.`);
        return;
      }
      // Completed all 3 shots of the camera strip
      capturedCanvas = stripFrames;
      els.retakeLabel.textContent = "RETAKE ALL";
      els.saveLabel.textContent = "SAVE STRIP";
      if (els.hudCapText) {
        els.hudCapText.textContent = "3-PHOTO STRIP READY";
      }
    } else {
      capturedCanvas = frame;
      els.retakeLabel.textContent = "RETAKE";
      els.saveLabel.textContent = "SAVE PHOTO";
      if (els.hudCapText) {
        els.hudCapText.textContent = "CAPTURED";
      }
    }

    printBlob = null;
    printPromise = getPrintBlob().then((b) => {
      printBlob = b;
      return b;
    });

    renderPreviewOnMonitor();

    setState("captured");
    announce(shotMode === "strip" ? "3-photo KANVERSE strip captured! Save, share or retake." : "Photo captured. Save, share or retake.");
    els.save.focus({ preventScroll: true });
  };
  step();
}

function stepNext() {
  if (app.dataset.state !== "strip-step") return;
  camera.unfreeze();
  setState("live");
  updateShotModeUI();
  capture();
}

function stepRetake() {
  if (app.dataset.state !== "strip-step") return;
  stripFrames.pop();
  camera.unfreeze();
  setState("live");
  updateShotModeUI();
  announce(`Shot reset. Get ready for shot ${stripFrames.length + 1}.`);
}

function flash() {
  els.flash.classList.remove("is-on");
  void els.flash.offsetWidth;
  els.flash.classList.add("is-on");
}

function retake() {
  capturedCanvas = null;
  stripFrames = [];
  printBlob = null;
  printPromise = null;
  updateShotModeUI();
  camera.unfreeze();
  if (camera.stream) setState("live");
  else startCamera();
  announce("Back to live camera.");
}

async function renderPreviewOnMonitor() {
  if (!capturedCanvas) return;
  try {
    const printCanvas = await renderPrint(capturedCanvas);
    const ctx = camera.ctx;
    const w = camera.canvas.width;
    const h = camera.canvas.height;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, w, h);

    const scale = Math.min(w / printCanvas.width, h / printCanvas.height);
    const dw = printCanvas.width * scale;
    const dh = printCanvas.height * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.drawImage(printCanvas, 0, 0, printCanvas.width, printCanvas.height, dx, dy, dw, dh);
  } catch (e) {
    /* ignore preview render error */
  }
}

/* =========================================================================
   Export: build a crisp, upscaled "print" or "strip" with Converse branding
   ========================================================================= */
async function renderPrint(srcInput) {
  const frames = Array.isArray(srcInput) ? srcInput : [srcInput];
  const first = frames[0];

  try {
    await document.fonts.load('16px "Press Start 2P"');
  } catch {
    /* fall back to monospace */
  }

  const S = Math.max(4, Math.round(CONFIG.exportTargetWidth / first.width)); // integer scale
  const pw = first.width * S;
  const ph = first.height * S;
  const u = S;
  const border = u;
  const gap = u * 3;
  const margin = u * 6;
  const fs = Math.max(16, Math.round(u * 3.2));
  const lineH = Math.round(fs * 1.6);

  const out = document.createElement("canvas");
  const ctx = out.getContext("2d");
  const font = `${fs}px "Press Start 2P", monospace`;
  ctx.font = font;

  // Word-wrap heading
  const words = headingText.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > pw && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);

  // Additional height for Converse Star Header & Footer
  const brandH = Math.round(fs * 1.8);
  const headH = lines.length * lineH + brandH;
  const footH = Math.round(fs * 3.2);
  const totalPhotosH = frames.length * ph + (frames.length - 1) * gap;

  out.width = pw + margin * 2;
  out.height = margin + headH + u * 3 + totalPhotosH + footH + margin * 0.6;

  // Paper + dither speckle
  ctx.fillStyle = "#f3efe4";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.fillStyle = "rgba(20,20,20,0.06)";
  for (let y = 0; y < out.height; y += u * 2) {
    for (let x = (y / (u * 2)) % 2 ? u : 0; x < out.width; x += u * 2) {
      ctx.fillRect(x, y, Math.max(2, u / 3), Math.max(2, u / 3));
    }
  }

  // Outer notched pixel frame
  const ob = Math.max(4, Math.round(u * 0.8));
  ctx.fillStyle = "#141414";
  ctx.fillRect(ob, 0, out.width - ob * 2, ob);
  ctx.fillRect(ob, out.height - ob, out.width - ob * 2, ob);
  ctx.fillRect(0, ob, ob, out.height - ob * 2);
  ctx.fillRect(out.width - ob, ob, ob, out.height - ob * 2);

  // Kanverse Retro Badge / Header Brand
  ctx.font = `${Math.max(12, Math.round(fs * 0.7))}px "Press Start 2P", monospace`;
  ctx.textBaseline = "top";
  ctx.fillStyle = "#141414";
  ctx.fillText("★ KANVERSE STUDIO ★", margin, margin);

  // Main Heading Text
  ctx.font = font;
  lines.forEach((l, i) => {
    const y = margin + brandH + i * lineH;
    ctx.fillStyle = "#cbc3ac";
    ctx.fillText(l, margin + 3, y + 3);
    ctx.fillStyle = "#141414";
    ctx.fillText(l, margin, y);
  });

  const px = margin;
  const startY = margin + headH + u * 3;

  // Draw each photo frame in order
  frames.forEach((src, idx) => {
    const py = startY + idx * (ph + gap);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(src, 0, 0, src.width, src.height, px, py, pw, ph);

    // CRT scanlines on each photo
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    const sl = Math.max(1, Math.round(u / 4));
    for (let y = py + u - sl; y < py + ph; y += u) ctx.fillRect(px, y, pw, sl);

    // Notched black border around each photo
    ctx.fillStyle = "#141414";
    ctx.fillRect(px, py - border, pw, border);
    ctx.fillRect(px, py + ph, pw, border);
    ctx.fillRect(px - border, py, border, ph);
    ctx.fillRect(px + pw, py, border, ph);
  });

  // Footer Branding: Converse Pixel Stamp & Date
  const d = new Date();
  const stamp = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  const ffs = Math.max(12, Math.round(fs * 0.6));
  ctx.font = `${ffs}px "Press Start 2P", monospace`;
  
  const lastPy = startY + (frames.length - 1) * (ph + gap);
  const fy = lastPy + ph + border + Math.round(u * 2);

  ctx.fillStyle = "#141414";
  ctx.fillText("KANVERSE · STUDIO", px, fy);
  
  ctx.fillStyle = "#5b574d";
  const modeName = PALETTES[palette] ? PALETTES[palette].label : "RGB";
  const labelText = frames.length > 1 ? `KANVERSE · 3-STRIP · ${modeName}` : `KANVERSE · ${modeName}`;
  ctx.fillText(labelText, px, fy + Math.round(ffs * 1.5));
  const sw = ctx.measureText(stamp).width;
  ctx.fillText(stamp, px + pw - sw, fy + Math.round(ffs * 1.5));

  return out;
}

const toBlob = (canvas) => new Promise((res) => canvas.toBlob(res, "image/png"));
const fileName = () => `${CONFIG.fileName}-${shotMode === "strip" ? "strip" : "photo"}-${Date.now()}.png`;

async function getPrintBlob() {
  if (!capturedCanvas) return null;
  const print = await renderPrint(capturedCanvas);
  return toBlob(print);
}

async function save() {
  const blob = printBlob || (await (printPromise || getPrintBlob()));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  beep(784, 0.06);
  setTimeout(() => beep(1046, 0.08), 70);
  announce("Saved to downloads.");
}

async function share() {
  try {
    const blob = printBlob || (await (printPromise || getPrintBlob()));
    if (!blob) return;
    const file = new File([blob], fileName(), { type: "image/png" });
    const data = { files: [file], title: headingText, text: headingText };
    if (navigator.canShare && !navigator.canShare(data)) throw new Error("cannot share files");
    await navigator.share(data);
    announce("Shared.");
  } catch (err) {
    if (err && err.name === "AbortError") return;
    console.warn("[PIXL-86] share failed:", err);
    announce("Sharing isn't available. Use Save Photo instead.");
  }
}

function setupShare() {
  let ok = false;
  try {
    if (navigator.share && navigator.canShare) {
      const probe = new File([new Uint8Array([0])], "probe.png", { type: "image/png" });
      ok = navigator.canShare({ files: [probe] });
    }
  } catch {
    ok = false;
  }
  els.share.hidden = !ok;
}

/* =========================================================================
   Wire up
   ========================================================================= */
async function boot() {
  typeHeading(headingText);
  makeNoise();
  applyPalette(palette);
  updateShotModeUI();
  setupShare();

  els.start.addEventListener("click", startCamera);
  els.retry.addEventListener("click", startCamera);
  els.capture.addEventListener("click", capture);
  els.shotModeBtn.addEventListener("click", toggleShotMode);
  els.stepRetake.addEventListener("click", stepRetake);
  els.stepNext.addEventListener("click", stepNext);
  els.switchCam.addEventListener("click", () => {
    beep(330, 0.05);
    camera.switchCamera();
  });
  els.mode.addEventListener("click", () => {
    const keys = Object.keys(PALETTES);
    applyPalette(keys[(keys.indexOf(palette) + 1) % keys.length]);
    beep(660, 0.04);
  });
  els.retake.addEventListener("click", retake);
  els.save.addEventListener("click", save);
  els.share.addEventListener("click", share);

  // Desktop: space bar = capture
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && app.dataset.state === "live" && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      capture();
    }
  });

  let resumeOnShow = false;
  window.addEventListener("pagehide", () => {
    resumeOnShow = !!camera.stream;
    camera.stop();
  });
  window.addEventListener("pageshow", (e) => {
    if (e.persisted && resumeOnShow) camera.start({ facing: camera.facing });
  });

  if (!PixelCamera.isSupported()) {
    showError(window.isSecureContext === false ? "insecure" : "unsupported");
    return;
  }

  try {
    const status = await navigator.permissions?.query({ name: "camera" });
    if (status?.state === "granted") {
      startCamera();
      return;
    }
    if (status?.state === "denied") {
      showError("denied");
      return;
    }
  } catch {
    /* Firefox / Safari permission query fallback */
  }
  setState("idle");
}

boot();
