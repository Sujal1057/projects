/**
 * PixelCamera — framework-agnostic real-time pixel-art webcam engine.
 *
 * - Streams the real device camera via getUserMedia (local only, never uploaded).
 * - Draws each frame into a tiny canvas (≈108–160px wide), then quantises it
 *   to a retro palette with ordered (Bayer) dithering.
 * - The canvas is displayed with `image-rendering: pixelated` so the browser
 *   scales it back up with nearest-neighbour — chunky, crisp pixels.
 *
 * Usage (vanilla or inside a React/Next `useEffect`):
 *   const cam = new PixelCamera({ video, canvas, onStateChange, onError });
 *   await cam.start();
 *   ...
 *   cam.destroy(); // stops every MediaStreamTrack
 */

/** Retro palettes. `type: "lum"` maps luminance onto a fixed colour ramp. */
export const PALETTES = {
  toon: { label: "TV TOON", type: "lum", colors: ["#181623", "#4d6275", "#c69b7b", "#f1e8d7"], swatch: ["#181623", "#4d6275", "#c69b7b", "#f1e8d7"] },
  ink: { label: "INK", type: "lum", colors: ["#141414", "#5b574d", "#b3ab95", "#f3efe4"], swatch: ["#141414", "#5b574d", "#b3ab95", "#f3efe4"] },
  mono: { label: "1-BIT", type: "lum", colors: ["#141414", "#f3efe4"], swatch: ["#141414", "#f3efe4", "#f3efe4", "#141414"] },
  rgb: { label: "RETRO RGB", type: "rgb", levels: 4, sat: 0.8, swatch: ["#9e5b53", "#53749e", "#539e65", "#c9b063"] },
  gb: { label: "GB", type: "lum", colors: ["#0f380f", "#306230", "#8bac0f", "#c4d878"], swatch: ["#0f380f", "#306230", "#8bac0f", "#c4d878"] },
};

const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16 - 0.5);

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Normalise any getUserMedia failure into a small set of UI-friendly codes. */
export function classifyCameraError(err) {
  if (err && err.code && typeof err.code === "string" && !err.name) return err.code;
  switch (err && err.name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
    case "SecurityError":
      return "denied";
    case "NotFoundError":
    case "DevicesNotFoundError":
    case "OverconstrainedError":
      return "notfound";
    case "NotReadableError":
    case "TrackStartError":
    case "AbortError":
      return "unavailable";
    default:
      return "unavailable";
  }
}

export class PixelCamera {
  /**
   * @param {object} opts
   * @param {HTMLVideoElement} opts.video       hidden <video> that receives the stream
   * @param {HTMLCanvasElement} opts.canvas     visible low-res canvas
   * @param {number} [opts.portraitWidth=108]   internal width for portrait screens
   * @param {number} [opts.landscapeWidth=160]  internal width for landscape screens
   * @param {number} [opts.fps=30]              processing cap (battery friendly)
   * @param {keyof PALETTES} [opts.palette="rgb"]
   * @param {(state: string) => void} [opts.onStateChange]
   * @param {(info: {code: string, error: unknown}) => void} [opts.onError]
   * @param {(info: {facing: string, canSwitch: boolean, width: number, height: number}) => void} [opts.onInfo]
   */
  constructor({
    video,
    canvas,
    portraitWidth = 108,
    landscapeWidth = 160,
    fps = 30,
    palette = "rgb",
    onStateChange = () => {},
    onError = () => {},
    onInfo = () => {},
  }) {
    this.video = video;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: false });
    this.portraitWidth = portraitWidth;
    this.landscapeWidth = landscapeWidth;
    this.frameInterval = 1000 / fps;
    this.onStateChange = onStateChange;
    this.onError = onError;
    this.onInfo = onInfo;

    this.stream = null;
    this.devices = [];
    this.facing = "user";
    this.deviceId = null;
    this.mirror = true;
    this.frozen = false;
    this.state = "idle";
    this.raf = 0;
    this.lastFrame = 0;
    this.startToken = 0;

    // Smoothed auto-levels so dim webcams still produce readable pixel art
    this.lo = 16;
    this.hi = 235;
    this.hist = new Uint32Array(64);

    this.setPalette(palette);

    this._loop = this._loop.bind(this);
    this._resize = this._resize.bind(this);
    this._onVisibility = this._onVisibility.bind(this);

    this.resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(this._resize) : null;
    this.resizeObserver?.observe(canvas);
    document.addEventListener("visibilitychange", this._onVisibility);
    this._resize();
  }

  static isSupported() {
    return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
  }

  get canSwitch() {
    return this.devices.length > 1;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  setPalette(name) {
    const p = PALETTES[name] || PALETTES.rgb;
    this.paletteName = PALETTES[name] ? name : "rgb";
    this.palette = p;
    this.paletteRgb = p.colors ? p.colors.map(hexToRgb) : null;
    if (this.frozen) return;
    // Repaint immediately even if the next video frame hasn't arrived yet.
    this.lastFrame = 0;
  }

  _setState(state) {
    if (this.state === state) return;
    this.state = state;
    this.onStateChange(state);
  }

  _emitInfo() {
    this.onInfo({ facing: this.facing, canSwitch: this.canSwitch, width: this.width, height: this.height });
  }

  /** Start (or restart) the camera. */
  async start({ facing = this.facing, deviceId = null } = {}) {
    if (!PixelCamera.isSupported()) {
      const code = typeof window !== "undefined" && window.isSecureContext === false ? "insecure" : "unsupported";
      this._setState("error");
      this.onError({ code, error: null });
      return false;
    }

    const token = ++this.startToken;
    this._stopTracks(); // Many phones can't open two cameras at once.
    this._setState("loading");

    const base = { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30, max: 30 } };
    const attempts = deviceId
      ? [{ ...base, deviceId: { exact: deviceId } }]
      : [{ ...base, facingMode: { exact: facing } }, { ...base, facingMode: { ideal: facing } }, true];

    let stream = null;
    let lastErr = null;
    for (const video of attempts) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video });
        break;
      } catch (err) {
        lastErr = err;
        // Permission problems won't be fixed by relaxing constraints.
        if (err && (err.name === "NotAllowedError" || err.name === "SecurityError")) break;
      }
    }

    if (token !== this.startToken) {
      stream?.getTracks().forEach((t) => t.stop());
      return false;
    }

    if (!stream) {
      this._setState("error");
      this.onError({ code: classifyCameraError(lastErr), error: lastErr });
      return false;
    }

    this.stream = stream;
    const track = stream.getVideoTracks()[0];
    const settings = track?.getSettings?.() || {};
    this.deviceId = settings.deviceId || deviceId || null;
    if (settings.facingMode) this.facing = settings.facingMode === "environment" ? "environment" : "user";
    else if (!deviceId) this.facing = facing;
    // Mirror selfies (and desktop webcams, which report no facingMode).
    this.mirror = settings.facingMode ? settings.facingMode !== "environment" : facing !== "environment";
    this.hasFacingMode = !!settings.facingMode;

    track?.addEventListener("ended", () => {
      if (this.stream === stream) {
        this._setState("error");
        this.onError({ code: "unavailable", error: null });
      }
    });

    this.video.srcObject = stream;
    this.video.setAttribute("playsinline", "");
    this.video.muted = true;
    try {
      await this.video.play();
    } catch (err) {
      /* Autoplay can reject on some browsers; loadeddata will still fire. */
    }

    await this._refreshDevices();
    if (token !== this.startToken) return false;

    this._resize();
    this._emitInfo();
    if (!this.frozen) this._setState("live");
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this._loop);
    return true;
  }

  async _refreshDevices() {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      this.devices = all.filter((d) => d.kind === "videoinput");
    } catch {
      this.devices = [];
    }
  }

  /** Toggle front/back on phones; cycle devices on desktops with several webcams. */
  async switchCamera() {
    if (!this.canSwitch) return false;
    if (this.hasFacingMode) {
      // Phones expose many rear lenses; facingMode picks the sensible default one.
      return this.start({ facing: this.facing === "user" ? "environment" : "user" });
    }
    const idx = this.devices.findIndex((d) => d.deviceId === this.deviceId);
    const nextDevice = this.devices[(idx + 1) % this.devices.length];
    return this.start({ deviceId: nextDevice.deviceId });
  }

  /** Freeze the current pixel frame. Returns a copy of the low-res canvas. */
  freeze() {
    this.frozen = true;
    const snap = document.createElement("canvas");
    snap.width = this.canvas.width;
    snap.height = this.canvas.height;
    snap.getContext("2d").drawImage(this.canvas, 0, 0);
    this.snapshot = snap;
    return snap;
  }

  unfreeze() {
    this.frozen = false;
    this.snapshot = null;
    this.lastFrame = 0;
    if (this.stream) this._setState("live");
  }

  stop() {
    this.startToken++;
    this._stopTracks();
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  destroy() {
    this.stop();
    this.resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this._onVisibility);
  }

  _stopTracks() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.video) this.video.srcObject = null;
  }

  _onVisibility() {
    // Release the camera in background tabs (privacy + battery), resume on return.
    if (document.hidden) {
      if (this.stream) {
        this._resumeOnVisible = true;
        this.stop();
      }
    } else if (this._resumeOnVisible) {
      this._resumeOnVisible = false;
      this.start({ facing: this.facing, deviceId: this.hasFacingMode ? null : this.deviceId });
    }
  }

  /** Match the internal resolution to the on-screen aspect ratio (square pixels). */
  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const aspect = rect.width / rect.height;
    const w = aspect < 1 ? this.portraitWidth : this.landscapeWidth;
    const h = Math.max(1, Math.round(w / aspect));
    if (this.canvas.width === w && this.canvas.height === h) return;

    this.canvas.width = w;
    this.canvas.height = h;
    if (this.frozen && this.snapshot) {
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.drawImage(this.snapshot, 0, 0, w, h);
    }
    this.lastFrame = 0;
    this._emitInfo();
  }

  _loop(now) {
    this.raf = requestAnimationFrame(this._loop);
    if (this.frozen || !this.stream) return;
    if (now - this.lastFrame < this.frameInterval) return;
    const v = this.video;
    if (v.readyState < 2 || !v.videoWidth) return;
    this.lastFrame = now;
    this._drawFrame();
  }

  _drawFrame() {
    const { ctx, video: v } = this;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // "object-fit: cover" crop of the source into the tiny canvas.
    const vw = v.videoWidth;
    const vh = v.videoHeight;
    const target = w / h;
    let sw = vw;
    let sh = vh;
    if (vw / vh > target) sw = vh * target;
    else sh = vw / target;
    const sx = (vw - sw) / 2;
    const sy = (vh - sh) / 2;

    ctx.save();
    if (this.mirror) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    // Smoothing ON for the *downsample* averages detail into each big pixel.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";
    ctx.drawImage(v, sx, sy, sw, sh, 0, 0, w, h);
    ctx.restore();

    const img = ctx.getImageData(0, 0, w, h);
    this._quantize(img.data, w, h);
    ctx.putImageData(img, 0, 0);
  }

  _quantize(d, w, h) {
    const n = w * h;
    const hist = this.hist;
    hist.fill(0);
    for (let i = 0; i < d.length; i += 4) {
      hist[((d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8) >> 2]++;
    }
    // 2nd / 98th percentile → smoothed levels
    let acc = 0;
    let lo = 0;
    let hi = 63;
    const loT = n * 0.02;
    const hiT = n * 0.98;
    for (let b = 0; b < 64; b++) {
      acc += hist[b];
      if (acc < loT) lo = b;
      if (acc < hiT) hi = b;
    }
    this.lo += (lo * 4 - this.lo) * 0.15;
    this.hi += (Math.max(hi * 4 + 4, lo * 4 + 48) - this.hi) * 0.15;
    const lvLo = this.lo;
    const scale = 255 / Math.max(32, this.hi - this.lo);

    const p = this.palette;
    if (p.type === "rgb") {
      const steps = p.levels - 1;
      const stepSize = 255 / steps;
      const sat = p.sat !== undefined ? p.sat : 0.8;
      for (let y = 0, i = 0; y < h; y++) {
        const row = (y & 3) << 2;
        for (let x = 0; x < w; x++, i += 4) {
          const t = BAYER_4[row | (x & 3)] * stepSize;
          let r = (d[i] - lvLo) * scale;
          let g = (d[i + 1] - lvLo) * scale;
          let b = (d[i + 2] - lvLo) * scale;
          const l = r * 0.3 + g * 0.59 + b * 0.11;
          r = l + (r - l) * sat + t;
          g = l + (g - l) * sat + t;
          b = l + (b - l) * sat + t;
          d[i] = Math.round(Math.min(255, Math.max(0, r)) / stepSize) * stepSize;
          d[i + 1] = Math.round(Math.min(255, Math.max(0, g)) / stepSize) * stepSize;
          d[i + 2] = Math.round(Math.min(255, Math.max(0, b)) / stepSize) * stepSize;
        }
      }
      return;
    }

    const cols = this.paletteRgb;
    const last = cols.length - 1;
    const spread = 1 / last;
    for (let y = 0, i = 0; y < h; y++) {
      const row = (y & 3) << 2;
      for (let x = 0; x < w; x++, i += 4) {
        let l = ((d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11 - lvLo) * scale) / 255;
        l += BAYER_4[row | (x & 3)] * spread;
        let k = Math.round(l * last);
        k = k < 0 ? 0 : k > last ? last : k;
        const c = cols[k];
        d[i] = c[0];
        d[i + 1] = c[1];
        d[i + 2] = c[2];
      }
    }
  }
}
