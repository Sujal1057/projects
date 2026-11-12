(function () {
  "use strict";

  var FLOWER_COUNT = 27;
  var FLOWER_SOURCES = [];
  for (var n = 1; n <= FLOWER_COUNT; n++) {
    FLOWER_SOURCES.push("assets/flowers/f" + n + ".png");
  }
  var SPRITE_SIZE = 200;

  var giftLanding = document.getElementById("gift-landing");
  var giftBoxBtn = document.getElementById("gift-box-btn");
  var bloomCanvas = document.getElementById("bloom-canvas");
  var scrapbookStage = document.getElementById("scrapbook-stage");
  var giftMusic = document.getElementById("gift-music");

  function playGiftMusic() {
    if (!giftMusic) return Promise.resolve();
    if (!giftMusic.paused) return Promise.resolve();
    try {
      var p = giftMusic.play();
      return p && typeof p.then === "function" ? p : Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  function setupDesktopAutoplay() {
    function removeUnlockListeners() {
      window.removeEventListener("pointerdown", unlockAudio, true);
      window.removeEventListener("keydown", unlockAudio, true);
      window.removeEventListener("touchstart", unlockAudio, true);
      window.removeEventListener("click", unlockAudio, true);
    }

    function unlockAudio() {
      playGiftMusic()
        .then(function () {
          removeUnlockListeners();
        })
        .catch(function () {});
    }

    playGiftMusic().catch(function () {
      window.addEventListener("pointerdown", unlockAudio, true);
      window.addEventListener("keydown", unlockAudio, true);
      window.addEventListener("touchstart", unlockAudio, true);
      window.addEventListener("click", unlockAudio, true);
    });
  }

  function initOrientationGate() {
    var overlay = document.getElementById("orientation-overlay");
    var portraitIcon = document.getElementById("orientation-icon-portrait");
    var landscapeIcon = document.getElementById("orientation-icon-landscape");
    var titleEl = document.getElementById("orientation-title");
    var subtitleEl = document.getElementById("orientation-subtitle");
    var actionBtn = document.getElementById("orientation-btn");
    if (!overlay || !actionBtn) return;

    var isMobile = false;
    var isPortrait = false;
    var hasStarted = false;

    function detectMobile() {
      var ua = navigator.userAgent || "";
      var mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      var iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
      return mobileUA || iPadOS;
    }

    function canFullscreen() {
      var elem = document.documentElement;
      return !!(
        elem.requestFullscreen ||
        elem.webkitRequestFullscreen ||
        elem.mozRequestFullScreen ||
        elem.msRequestFullscreen
      );
    }

    function renderOverlay() {
      if (!isMobile || (hasStarted && !isPortrait)) {
        overlay.classList.add("hidden");
        overlay.setAttribute("aria-hidden", "true");
        return;
      }

      overlay.classList.remove("hidden");
      overlay.setAttribute("aria-hidden", "false");

      if (isPortrait) {
        if (portraitIcon) portraitIcon.classList.remove("hidden");
        if (landscapeIcon) landscapeIcon.classList.add("hidden");
        if (titleEl) titleEl.textContent = "Rotate Your Device";
        if (subtitleEl) {
          subtitleEl.textContent = "Please turn your phone sideways to landscape mode to unlock the experience.";
        }
        actionBtn.disabled = true;
        actionBtn.className = "orientation-btn disabled";
        actionBtn.textContent = "Waiting for rotation...";
      } else {
        if (portraitIcon) portraitIcon.classList.add("hidden");
        if (landscapeIcon) landscapeIcon.classList.remove("hidden");
        if (titleEl) titleEl.textContent = "Ready For Magic?";
        if (canFullscreen()) {
          if (subtitleEl) subtitleEl.textContent = "You are in landscape mode! Click below to enter full screen.";
          actionBtn.textContent = "Enter Fullscreen \u26F6";
        } else {
          if (subtitleEl) subtitleEl.textContent = "You are in landscape mode! Tap below to open your gift.";
          actionBtn.textContent = "Continue";
        }
        actionBtn.disabled = false;
        actionBtn.className = "orientation-btn active";
      }
    }

    function checkOrientation() {
      isMobile = detectMobile();
      isPortrait = window.innerHeight > window.innerWidth;
      if (!isMobile) {
        hasStarted = true;
      }
      renderOverlay();
    }

    function handleFullscreenChange() {
      var isFS = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      if (!isFS && isMobile) {
        hasStarted = false;
        renderOverlay();
      }
    }

    actionBtn.addEventListener("click", function () {
      if (isPortrait) return;
      playGiftMusic().catch(function () {});
      var elem = document.documentElement;
      try {
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(function () {});
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      } catch (err) {}
      hasStarted = true;
      renderOverlay();
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 150);
    });

    checkOrientation();
    if (!isMobile) {
      setupDesktopAutoplay();
    }
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", function () {
      checkOrientation();
      setTimeout(checkOrientation, 120);
    });
    if (window.screen && window.screen.orientation && window.screen.orientation.addEventListener) {
      window.screen.orientation.addEventListener("change", function () {
        checkOrientation();
        setTimeout(checkOrientation, 120);
      });
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
  }

  initOrientationGate();

  // Pre-bake scaled offscreen sprites once so frames only run fast drawImage calls.
  var spriteBank = new Array(FLOWER_COUNT);
  var spritesReady = false;

  function buildSprites() {
    var loaded = 0;

    FLOWER_SOURCES.forEach(function (src, idx) {
      var img = new Image();
      var onDone = function () {
        loaded++;
        if (loaded === FLOWER_SOURCES.length) {
          spritesReady = true;
        }
      };
      img.onload = function () {
        var off = document.createElement("canvas");
        off.width = SPRITE_SIZE;
        off.height = SPRITE_SIZE;
        var octx = off.getContext("2d");
        octx.drawImage(img, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
        spriteBank[idx] = off;
        onDone();
      };
      img.onerror = onDone;
      img.src = src;
    });
  }

  buildSprites();

  var bloomRafId = null;

  function easeOutBack(t) {
    var c1 = 1.70158;
    var c3 = c1 + 1;
    var p = t - 1;
    return 1 + c3 * p * p * p + c1 * p * p;
  }

  function startGiftOpen() {
    if (giftLanding.classList.contains("state-bloom") || giftLanding.classList.contains("state-fall")) {
      return;
    }
    giftLanding.classList.add("state-bloom");

    playGiftMusic().catch(function () {});

    if (!bloomCanvas) {
      revealScrapbookBehindFlowers();
      goToScrapbook();
      return;
    }

    var ctx = bloomCanvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth;
    var h = window.innerHeight;

    function resizeBloomCanvas() {
      w = window.innerWidth;
      h = window.innerHeight;
      bloomCanvas.width = Math.round(w * dpr);
      bloomCanvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeBloomCanvas();
    window.addEventListener("resize", resizeBloomCanvas);

    var cx = w / 2;
    var cy = h / 2;
    var goldenAngle = Math.PI * (3 - Math.sqrt(5));
    var cornerDist = Math.hypot(w, h) / 2;
    var isMobile = Math.min(w, h) < 640;
    var area = w * h;

    var baseTarget = isMobile ? 380 : 580;
    var scaleFactor = Math.min(1.4, Math.max(1, area / (isMobile ? 480000 : 1500000)));
    var targetCount = Math.min(isMobile ? 520 : 760, Math.round(baseTarget * scaleFactor));

    var edgeBuffer = Math.max(70, cornerDist * 0.06);
    var maxRadius = cornerDist + edgeBuffer;
    var spacing = (maxRadius / Math.sqrt(targetCount)) * 0.85;

    var sizeBase = spacing * 4.8;
    var minSize = isMobile ? 84 : 112;
    var maxSize = isMobile ? 250 : 340;

    var flowers = new Array(targetCount);
    for (var i = 0; i < targetCount; i++) {
      var angle = i * goldenAngle;
      var radius = spacing * Math.sqrt(i + 1);
      var size = Math.min(maxSize, Math.max(minSize, sizeBase * (0.76 + Math.random() * 0.48)));
      var yPos = cy + Math.sin(angle) * radius;
      flowers[i] = {
        x: cx + Math.cos(angle) * radius,
        y: yPos,
        size: size,
        rstart: ((Math.random() * 30 - 15) * Math.PI) / 180,
        flowerIdx: Math.floor(Math.random() * FLOWER_COUNT),
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.0012 + Math.random() * 0.001,
        spawnedAt: -1,
        fallDist: h + size * 1.8 - yPos,
        fdur: 1200 + ((i * 37) % 100) * 5,
        fdelay: ((i * 53) % 100) * 3.5,
        frot: ((((i * 91) % 200) - 100) * 0.9 * Math.PI) / 180,
        fsway: (((i * 67) % 200) - 100) * (size * 0.009 + 0.3),
      };
    }

    var sparkleCount = Math.min(44, Math.max(20, Math.round(area / 55000)));
    var sparkles = new Array(sparkleCount);
    for (var s = 0; s < sparkleCount; s++) {
      sparkles[s] = {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 2 + Math.random() * 3.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.0025,
        peak: 0.5 + Math.random() * 0.4,
      };
    }

    var phase = "bloom";
    var bloomStart = performance.now();
    var growDuration = 4800;
    var bloomCompleteAt = 0;
    var fallStart = 0;
    var fallTotalDuration = 2100;
    var spawned = 0;

    function beginFall(now) {
      phase = "fall";
      fallStart = now;
      giftLanding.classList.remove("state-bloom");
      giftLanding.classList.add("state-fall");
      revealScrapbookBehindFlowers();
    }

    function drawSparkles(now, globalAlpha) {
      if (globalAlpha <= 0.01) return;
      for (var i = 0; i < sparkles.length; i++) {
        var sp = sparkles[i];
        var pulse = 0.5 + 0.5 * Math.sin(now * sp.speed + sp.phase);
        var alpha = pulse * sp.peak * globalAlpha;
        if (alpha <= 0.02) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#fff6e5";
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r * (0.4 + 0.6 * pulse), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function renderFrame(now) {
      ctx.clearRect(0, 0, w, h);

      if (!spritesReady) {
        bloomRafId = requestAnimationFrame(renderFrame);
        return;
      }

      if (phase === "bloom") {
        var elapsed = now - bloomStart;
        var progress = Math.min(1, elapsed / growDuration);
        var eased = Math.pow(progress, 2.35);
        var wanted = Math.floor(eased * targetCount);

        while (spawned < wanted) {
          flowers[spawned].spawnedAt = now;
          spawned++;
        }

        for (var i = 0; i < spawned; i++) {
          var f = flowers[i];
          var age = Math.min(1, (now - f.spawnedAt) / 460);
          var scale = age < 1 ? 0.15 + 0.85 * easeOutBack(age) : 1;
          var floatY = Math.sin(now * f.floatSpeed + f.floatPhase) * 4.5;
          var sprite = spriteBank[f.flowerIdx];
          if (!sprite) continue;
          var drawSize = f.size * scale;

          ctx.globalAlpha = age < 1 ? Math.min(1, age * 1.4) : 1;
          ctx.save();
          ctx.translate(f.x, f.y + floatY);
          ctx.rotate(f.rstart);
          ctx.drawImage(sprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
          ctx.restore();
        }

        drawSparkles(now, 1);

        if (progress >= 1) {
          if (!bloomCompleteAt) {
            bloomCompleteAt = now;
          } else if (now - bloomCompleteAt >= 600) {
            beginFall(now);
          }
        }
        bloomRafId = requestAnimationFrame(renderFrame);
      } else if (phase === "fall") {
        var fallElapsed = now - fallStart;
        var sparkleFade = Math.max(0, 1 - fallElapsed / 900);

        for (var j = 0; j < spawned; j++) {
          var fl = flowers[j];
          var localElapsed = Math.max(0, fallElapsed - fl.fdelay);
          var t = Math.min(1, localElapsed / fl.fdur);
          var easeFall = t * t * (0.45 + 0.55 * t);
          var swayOffset = Math.sin(t * Math.PI * 1.6) * fl.fsway;
          var curX = fl.x + swayOffset;
          var curY = fl.y + fl.fallDist * easeFall;
          var curRot = fl.rstart + fl.frot * t;
          var alpha = t > 0.85 ? Math.max(0, 1 - (t - 0.85) / 0.15) : 1;

          if (alpha <= 0.01) continue;
          var spr = spriteBank[fl.flowerIdx];
          if (!spr) continue;

          ctx.globalAlpha = alpha;
          ctx.save();
          ctx.translate(curX, curY);
          ctx.rotate(curRot);
          ctx.drawImage(spr, -fl.size / 2, -fl.size / 2, fl.size, fl.size);
          ctx.restore();
        }

        drawSparkles(now, sparkleFade);
        ctx.globalAlpha = 1;

        if (fallElapsed >= fallTotalDuration) {
          window.removeEventListener("resize", resizeBloomCanvas);
          goToScrapbook();
          bloomRafId = null;
          return;
        }
        bloomRafId = requestAnimationFrame(renderFrame);
      }
    }

    bloomRafId = requestAnimationFrame(renderFrame);
  }

  giftBoxBtn.addEventListener("click", startGiftOpen);

  function revealScrapbookBehindFlowers() {
    scrapbookStage.classList.add("shown");
    initScrapbook();
  }

  function goToScrapbook() {
    if (bloomRafId) {
      cancelAnimationFrame(bloomRafId);
      bloomRafId = null;
    }
    giftLanding.classList.add("hidden");
  }

  var scrapbookInitialised = false;

  function initScrapbook() {
    if (scrapbookInitialised) return;
    scrapbookInitialised = true;

    var bookEl = document.getElementById("book");
    var spineShadow = document.getElementById("spine-shadow");
    var isMobile = window.innerWidth < 768;

    var pageFlip = new St.PageFlip(bookEl, {
      width: isMobile ? 360 : 300,
      height: isMobile ? 480 : 400,
      size: "stretch",
      minWidth: 200,
      maxWidth: 500,
      minHeight: 260,
      maxHeight: 600,
      maxShadowOpacity: 0.35,
      drawShadow: true,
      showCover: true,
      mobileScrollSupport: true,
      useMouseEvents: true,
      flippingTime: 600,
      display: "landscape", // Yeh landscape spread rakhega jisse side wala page ka thoda hissa dikhega
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    function attachShadowToBookWrapper() {
      var wrapper = bookEl.querySelector(".stf__wrapper") || bookEl.querySelector(".stf__parent");
      if (wrapper && spineShadow) {
        wrapper.insertBefore(spineShadow, wrapper.firstChild);
      }
    }

    function updateSpineShadow() {
      try {
        var total = pageFlip.getPageCount();
        var current = pageFlip.getCurrentPageIndex();
        var orientation = pageFlip.getOrientation();
        var isSpread = orientation === "landscape" && current > 0 && current < total - 1;

        if (isSpread) {
          spineShadow.classList.add("visible");
        } else {
          spineShadow.classList.remove("visible");
        }
      } catch (err) {
        spineShadow.classList.remove("visible");
      }
    }

    function centerSinglePageView() {
      try {
        var total = pageFlip.getPageCount();
        var current = pageFlip.getCurrentPageIndex();
        var orientation = pageFlip.getOrientation();
        var rect = pageFlip.getRender().getRect();
        var pageWidth = rect && rect.pageWidth ? rect.pageWidth : 0;
        var target = bookEl.querySelector(".stf__parent") || bookEl.querySelector(".stf__wrapper");
        if (!target || !pageWidth) return;
        var isSinglePageView = current === 0 || current >= total - 1;
        if (orientation === "landscape" && isSinglePageView) {
          var shift = current === 0 ? -(pageWidth / 2) : pageWidth / 2;
          target.style.transition = "transform 0.25s ease";
          target.style.transform = "translateX(" + shift + "px)";
        } else {
          target.style.transform = "translateX(0)";
        }
      } catch (err) { }
    }

    pageFlip.on("flip", function () {
      requestAnimationFrame(centerSinglePageView);
      updateSpineShadow();
    });

    pageFlip.on("changeState", function () {
      updateSpineShadow();
    });

    pageFlip.on("changeOrientation", function () {
      requestAnimationFrame(function () {
        centerSinglePageView();
        updateSpineShadow();
      });
    });

    window.addEventListener("resize", function () {
      requestAnimationFrame(function () {
        centerSinglePageView();
        updateSpineShadow();
      });
    });

    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        requestAnimationFrame(function () {
          centerSinglePageView();
          updateSpineShadow();
        });
      }, 150);
    });

    setTimeout(function () {
      attachShadowToBookWrapper();
      centerSinglePageView();
      updateSpineShadow();
    }, 80);

    (function () {
      var canvas = document.getElementById("spiral-canvas");
      var ctx = canvas.getContext("2d");
      var box = document.getElementById("book-container");
      var dpr = Math.min(window.devicePixelRatio || 1, 3);
      var flipTimer = null;

      function sizeCanvas() {
        var w = box.offsetWidth;
        var h = box.offsetHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function paint() {
        var cw = box.offsetWidth;
        var ch = box.offsetHeight;
        ctx.clearRect(0, 0, cw, ch);
        var boxR = box.getBoundingClientRect();
        var all = document.querySelectorAll(".stf__page");
        for (var i = 0; i < all.length; i++) {
          var el = all[i];
          var r = el.getBoundingClientRect();
          if (r.width < 30 || r.height < 30) continue;
          if (r.right <= boxR.left + 8 || r.left >= boxR.right - 8) continue;
          var pg = el.querySelector(".page[data-spiral]");
          if (!pg) continue;
          var side = pg.getAttribute("data-spiral");
          var isCover = pg.classList.contains("page-cover");
          var px = r.left - boxR.left;
          var py = r.top - boxR.top;
          drawCoils(px, py, r.width, r.height, side, isCover);
        }
      }

      function drawCoils(px, py, pw, ph, side, isCover) {
        var NUM = 24;
        var MARGIN = Math.max(11, pw * 0.042);
        var RX = Math.max(4.5, pw * 0.034);
        var RY = RX * 0.68;
        var SW = Math.max(2.2, RX * 0.44);
        var YTOP = ph * 0.032;
        var YBOT = ph * 0.968;
        var cx = side === "left" ? px + MARGIN : px + pw - MARGIN;
        for (var i = 0; i < NUM; i++) {
          var t = NUM > 1 ? i / (NUM - 1) : 0.5;
          var cy = py + YTOP + t * (YBOT - YTOP);
          ctx.beginPath();
          ctx.ellipse(cx, cy, Math.max(1, RX * 0.26), Math.max(0.6, RY * 0.33), 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,0,0,0.24)";
          ctx.fill();
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "rgba(0,0,0,0.13)";
          ctx.stroke();
          var sx = side === "left" ? cx + 1.6 : cx - 1.6;
          ring(sx, cy + 1.8, RX + 0.7, RY + 0.4, SW + 1.1, side, isCover, "rgba(0,0,0,0.26)");
          ring(cx, cy + 0.6, RX, RY, SW + 0.5, side, isCover, "#050505");
          ring(cx, cy, RX, RY, SW, side, isCover, "#111111");
          ring(cx, cy - 0.5, RX * 0.9, RY * 0.88, Math.max(0.4, SW - 1.5), side, isCover, "#1a1a1a");
          ring(cx, cy - 1.5, RX * 0.7, RY * 0.62, 1.2, side, isCover, "rgba(148,148,148,0.17)");
          ring(cx, cy - 2.3, RX * 0.4, RY * 0.38, 0.6, side, isCover, "rgba(255,255,255,0.07)");
        }
      }

      function ring(cx, cy, rx, ry, sw, side, isCover, color) {
        rx = Math.max(0.5, rx);
        ry = Math.max(0.5, ry);
        sw = Math.max(0.1, sw);
        ctx.beginPath();
        if (isCover) {
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        } else {
          if (side === "left") {
            ctx.ellipse(cx, cy, rx, ry, 0, -Math.PI * 0.5, Math.PI * 0.5, false);
          } else {
            ctx.ellipse(cx, cy, rx, ry, 0, Math.PI * 0.5, Math.PI * 1.5, false);
          }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = sw;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      pageFlip.on("flip", function () {
        canvas.classList.add("fade-out");
        clearTimeout(flipTimer);
        flipTimer = setTimeout(function () {
          sizeCanvas();
          paint();
          canvas.classList.remove("fade-out");
        }, 200);
      });

      pageFlip.on("changeOrientation", function () {
        canvas.classList.add("fade-out");
        clearTimeout(flipTimer);
        flipTimer = setTimeout(function () {
          sizeCanvas();
          paint();
          canvas.classList.remove("fade-out");
        }, 350);
      });

      setTimeout(function () {
        sizeCanvas();
        paint();
      }, 130);

      window.addEventListener("resize", function () {
        clearTimeout(flipTimer);
        flipTimer = setTimeout(function () {
          sizeCanvas();
          paint();
        }, 60);
      });
    })();
  }
})();