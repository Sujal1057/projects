(function () {
  "use strict";

      
  var PASSCODE = "1234";
  var LOADING_MS = 3000;

  var FLOWER_CYCLE = [
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-3.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-1.png",
    "assets/flowers/flower-2.png",
  ];

  var PHOTOS = [
    "assets/photos/image1.jpg",
    "assets/photos/image2.jpg",
    "assets/photos/image3.jpg",
    "assets/photos/image4.jpg",
    "assets/photos/image5.jpg",
    "assets/photos/image6.jpg",
    "assets/photos/image7.jpg",
    "assets/photos/image8.jpg",
    "assets/photos/image9.jpg",
    "assets/photos/image10.jpg",
  ];

  var LETTER_TEXT =
    "To My Dearest, I am writing this little note just because you have been on my mind all day long, which is nothing new since you pretty much live there anyway. Every single time I think about your smile, my heart does a tiny happy dance. I find myself smiling at my phone like a complete fool whenever your name pops up, and honestly, it is my absolute favorite part of the day. You have this wonderful way of making the whole world feel brighter and sweeter just by being you. Thank you for all the warm hugs, the soft giggles we share, and the beautiful comfort of knowing you are mine. Being your boyfriend is the happiest thing that has ever happened to me, and I count myself incredibly lucky to hold your hand and walk through life beside you. Please never forget how deeply you are loved and cherished. You are my favorite person, my safest space, and my absolute dream come true. I love you more than all the stars in the night sky, and I cannot wait until the next time I get to hold you close. Forever and always yours, Your Love";

      
  var giftLanding = document.getElementById("gift-landing");
  var giftBoxBtn = document.getElementById("gift-box-btn");
  var bloomField = document.getElementById("bloom-field");
  var page2 = document.getElementById("page2");
  var page3 = document.getElementById("page3");
  var page3Back = document.getElementById("page3-back");

  var lockBtn = document.getElementById("lock-btn");
  var lockHint = document.getElementById("lock-hint");
  var lockUnlockedMsg = document.getElementById("lock-unlocked-msg");

  var pkOverlay = document.getElementById("passkey-overlay");
  var pkClose = document.getElementById("pk-close");
  var pkDotsWrap = document.getElementById("pk-dots");
  var pkErrorMsg = document.getElementById("pk-error-msg");
  var pkTitle = document.getElementById("pk-title");
  var pkKeypad = document.getElementById("pk-keypad");
  var pkParticles = document.getElementById("pk-particles");

  var loadingOverlay = document.getElementById("loading-overlay");

  var savedScrollY = 0;

      
  var flowerIdCounter = 0;

  function spawnFlower(x, y, size, duration, delay) {
    var img = document.createElement("img");
    img.src = FLOWER_CYCLE[flowerIdCounter % FLOWER_CYCLE.length];
    img.alt = "";
    img.className = "bloom-flower in";
    img.loading = "eager";
    img.decoding = "async";
    img.draggable = false;
    img.style.width = size + "px";
    img.style.height = size + "px";
    img.style.setProperty("--fx", x - size / 2 + "px");
    img.style.setProperty("--fy", y - size / 2 + "px");
    img.style.setProperty("--dur", duration + "s");
    img.style.setProperty("--delay", delay + "s");
    img.dataset.id = flowerIdCounter;
    img.dataset.x = x;
    img.dataset.y = y;
    img.dataset.size = size;
    bloomField.appendChild(img);
    flowerIdCounter++;
    return img;
  }

  function startGiftOpen() {
    if (giftLanding.classList.contains("state-bloom")) return;
    giftLanding.classList.add("state-bloom");

    var w = window.innerWidth,
      h = window.innerHeight;
    var cx = w / 2,
      cy = h / 2;
    var maxRadius = Math.hypot(w, h) / 2 + 160;
    var goldenAngle = Math.PI * (3 - Math.sqrt(5));
    var area = w * h;
    var isMobile = Math.min(w, h) < 640;
    var spacing = isMobile ? 30 : area > 1.6e6 ? 22 : 26;
    var maxCount = Math.min(Math.ceil(Math.pow(maxRadius / spacing, 2)) + 40, isMobile ? 260 : 520);

    var spawned = 0;
    var startTime = performance.now();

    function tick() {
      var elapsed = performance.now() - startTime;
      var progress = Math.min(1, elapsed / 6000);
      var targetCount = Math.floor(progress * maxCount);
      while (spawned < targetCount) {
        var angle = spawned * goldenAngle;
        var radius = spacing * Math.sqrt(spawned + 1);
        var size = (isMobile ? 90 : 130) + Math.random() * (isMobile ? 50 : 70);
        var x = cx + Math.cos(angle) * radius;
        var y = cy + Math.sin(angle) * radius;
        var duration = 3 + Math.random() * 4;
        var delay = -Math.random() * 6;
        spawnFlower(x, y, size, duration, delay);
        spawned++;
      }
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        startFall();
      }
    }
    requestAnimationFrame(tick);
  }

  function startFall() {
    giftLanding.classList.remove("state-bloom");
    giftLanding.classList.add("state-fall");

    var flowers = bloomField.querySelectorAll(".bloom-flower");
    flowers.forEach(function (el) {
      var id = parseInt(el.dataset.id, 10);
      var x = parseFloat(el.dataset.x);
      var y = parseFloat(el.dataset.y);
      var size = parseFloat(el.dataset.size);
      var fall = window.innerHeight + size * 2 - y;
      var fdur = 1.2 + ((id * 37) % 100) / 100 * 0.6;
      var fdelay = ((id * 53) % 100) / 100 * 0.35;
      var frot = (((id * 91) % 200) - 100) * 3;

      el.style.setProperty("--ffall", y + fall + "px");
      el.style.setProperty("--frot", frot + "deg");
      el.style.setProperty("--fdur", fdur + "s");
      el.style.setProperty("--fdelay", fdelay + "s");
      el.classList.remove("in");
      el.classList.add("falling");
    });

    setTimeout(goToPage2, 2000);
  }

  function goToPage2() {
    giftLanding.classList.add("hidden");
    page2.classList.add("shown");
    initPage2();
  }

  giftBoxBtn.addEventListener("click", startGiftOpen);

      
  var page2Initialised = false;

  function initPage2() {
    if (page2Initialised) return;
    page2Initialised = true;

    var rose = document.getElementById("rose-deco");
    setTimeout(function () {
      rose.classList.add("spring");
    }, 400);

    observeOnce(document.getElementById("smile-card"), 0.3, function (el) {
      el.classList.add("in");
    });
  }

  function observeOnce(el, threshold, cb) {
    if (!el) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            obs.disconnect();
            cb(el);
          }
        });
      },
      { threshold: threshold }
    );
    obs.observe(el);
  }

      
  var isUnlocked = false;

  lockBtn.addEventListener("click", function () {
    openPasskey();
  });

      
  var pkEntered = "";
  var pkBusy = false;

  function buildParticles() {
    pkParticles.innerHTML = "";
    for (var i = 0; i < 24; i++) {
      var p = document.createElement("div");
      p.className = "pk-particle";
      var size = 1.5 + Math.random() * 3;
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.opacity = 0.12 + Math.random() * 0.3;
      p.style.animationDuration = 5 + Math.random() * 7 + "s";
      p.style.animationDelay = Math.random() * -10 + "s";
      pkParticles.appendChild(p);
    }
  }

  function renderPkDots() {
    var dots = pkDotsWrap.querySelectorAll(".pk-dot");
    var lines = pkDotsWrap.querySelectorAll(".pk-line");
    dots.forEach(function (dot, i) {
      dot.classList.toggle("filled", i < pkEntered.length);
    });
    lines.forEach(function (line, i) {
      line.classList.toggle("on", i + 1 <= pkEntered.length);
    });
  }

  function openPasskey() {
    pkEntered = "";
    pkBusy = false;
    pkOverlay.classList.remove("error", "success");
    pkTitle.textContent = "Enter Passkey";
    pkErrorMsg.classList.remove("show");
    buildParticles();
    renderPkDots();
    pkOverlay.classList.add("shown");
  }

  function closePasskey() {
    pkOverlay.classList.remove("shown", "error", "success");
  }

  pkClose.addEventListener("click", closePasskey);

  function pkPress(key) {
    if (pkBusy) return;
    if (key === "del") {
      pkEntered = pkEntered.slice(0, -1);
      renderPkDots();
      return;
    }
    if (pkEntered.length >= 4) return;
    pkEntered += key;
    renderPkDots();
    if (pkEntered.length === 4) {
      pkBusy = true;
      if (pkEntered === PASSCODE) {
        pkOverlay.classList.add("success");
        pkTitle.textContent = "Unlocked";
        setTimeout(function () {
          closePasskey();
          startLoading();
        }, 700);
      } else {
        pkOverlay.classList.add("error");
        pkDotsWrap.classList.add("shake", "error");
        pkErrorMsg.classList.add("show");
        setTimeout(function () {
          pkDotsWrap.classList.remove("shake", "error");
          pkOverlay.classList.remove("error");
          pkErrorMsg.classList.remove("show");
          pkEntered = "";
          renderPkDots();
          pkBusy = false;
        }, 700);
      }
    }
  }

  pkKeypad.querySelectorAll(".pk-key[data-key]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      pkPress(btn.getAttribute("data-key"));
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!pkOverlay.classList.contains("shown")) return;
    if (e.key >= "0" && e.key <= "9") pkPress(e.key);
    if (e.key === "Backspace") pkPress("del");
    if (e.key === "Escape") closePasskey();
  });

      
  function startLoading() {
    loadingOverlay.classList.remove("fade-out");
    loadingOverlay.classList.add("shown");
    setTimeout(function () {
      loadingOverlay.classList.add("fade-out");
      setTimeout(finishUnlock, 450);
    }, LOADING_MS - 450);
  }

  function finishUnlock() {
    loadingOverlay.classList.remove("shown", "fade-out");
    isUnlocked = true;

    lockBtn.style.display = "none";
    lockHint.style.display = "none";
    lockUnlockedMsg.style.display = "block";

    setTimeout(function () {
      savedScrollY = window.scrollY;
      page2.classList.remove("shown");
      page3.classList.add("shown");
      window.scrollTo(0, 0);
      revealLockedContent();
    }, 700);
  }

  page3Back.addEventListener("click", function () {
    page3.classList.remove("shown");
    page2.classList.add("shown");
    window.scrollTo(0, savedScrollY);

    isUnlocked = false;
    lockBtn.style.display = "";
    lockHint.style.display = "";
    lockUnlockedMsg.style.display = "none";
  });

        
  var lockedContentBuilt = false;

  function revealLockedContent() {
    if (!lockedContentBuilt) {
      buildPhotoGrid();
      buildLetter();
      lockedContentBuilt = true;
    }

    observeOnce(document.getElementById("photo-grid-section"), 0.15, function () {
      var cards = document.querySelectorAll(".photo-card");
      cards.forEach(function (card, i) {
        setTimeout(function () {
          card.classList.add("in");
        }, i * 130);
      });
    });

    observeOnce(document.getElementById("letter-section"), 0.15, function () {
      var words = document.querySelectorAll(".letter-card .word");
      var i = 0;
      function next() {
        if (i >= words.length) return;
        words[i].classList.add("in");
        i++;
        setTimeout(next, 90);
      }
      next();
    });

    var footerH2 = document.querySelector("#footer-section h2");
    var footerP = document.querySelector("#footer-section p");
    observeOnce(document.getElementById("footer-section"), 0.3, function () {
      footerH2.classList.add("in");
      footerP.classList.add("in");
    });
  }

  function buildPhotoGrid() {
    var grid = document.getElementById("photo-grid");
    var tilts = [-5, 4, -3, 6, -6, 3, -4, 5, -3, 4];
    var sizes = ["lg", "sm", "md", "lg", "sm", "md", "lg", "sm", "md", "lg"];
    PHOTOS.forEach(function (src, n) {
      var card = document.createElement("div");
      card.className = "photo-card size-" + sizes[n % sizes.length];
      card.style.setProperty("--rot", tilts[n % tilts.length] + "deg");
      var img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      card.appendChild(img);
      grid.appendChild(card);
    });
  }

  function buildLetter() {
    var wrap = document.getElementById("letter-words");
    var words = LETTER_TEXT.split(/\s+/);
    words.forEach(function (w) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      wrap.appendChild(span);
      wrap.appendChild(document.createTextNode(" "));
    });
  }
})();
