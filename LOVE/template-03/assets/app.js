/**
 * LOVE TEMPLATE 03 - Vintage Valentine & Baroque Memory Gallery
 * Interactivity: Lightbox, Audio Player, Hearts Particle Burst, Audio Synthesis
 */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // 1. Audio Element & Toggle Button
  const bgMusic = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
  let isPlaying = false;

  function toggleMusic() {
    if (!bgMusic) return;
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.classList.remove("playing");
      isPlaying = false;
    } else {
      bgMusic.play().then(() => {
        musicBtn.classList.add("playing");
        isPlaying = true;
      }).catch(err => {
        console.log("Audio playback blocked:", err);
      });
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // Auto-start music on first user interaction if not already playing
  function unlockAudioOnFirstInteraction() {
    if (!isPlaying && bgMusic) {
      bgMusic.play().then(() => {
        isPlaying = true;
        if (musicBtn) musicBtn.classList.add("playing");
      }).catch(() => {});
    }
    document.removeEventListener("pointerdown", unlockAudioOnFirstInteraction);
  }
  document.addEventListener("pointerdown", unlockAudioOnFirstInteraction, { once: true });

  // 2. Web Audio Typewriter Sound Synthesizer
  let audioCtx = null;
  function playTypewriterClick() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      // Realistic vintage mechanical snap sound
      osc.type = "sine";
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Interactive Typewriter Keys Area
  const keysArea = document.querySelector(".typewriter-keys-layer");
  if (keysArea) {
    keysArea.addEventListener("click", function (e) {
      playTypewriterClick();
      createHeart(e.clientX, e.clientY);
    });
  }

  // 3. Floating Hearts Particle Effect on Click
  const heartIcons = ["♥", "♡", "❤", "✦", "✧"];
  const heartColors = ["#99C6E3", "#C0D2DE", "#f4a261", "#e76f51", "#282F4D"];

  function createHeart(x, y) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    heart.style.fontSize = (16 + Math.random() * 18) + "px";

    const dx = (Math.random() - 0.5) * 80 + "px";
    const rot = (Math.random() - 0.5) * 60 + "deg";
    heart.style.setProperty("--dx", dx);
    heart.style.setProperty("--rot", rot);

    document.body.appendChild(heart);
    setTimeout(() => {
      heart.remove();
    }, 1400);
  }

  document.addEventListener("click", function (e) {
    // Only spawn particle if not clicking on modal close or music btn
    if (!e.target.closest(".music-btn") && !e.target.closest(".modal-close")) {
      createHeart(e.clientX, e.clientY);
    }
  });

  // 4. Smooth Scroll to Section 2 and Section 3
  const scrollIndicator = document.getElementById("scroll-to-gallery");
  const section2 = document.getElementById("section-2");

  if (scrollIndicator && section2) {
    scrollIndicator.addEventListener("click", function (e) {
      e.stopPropagation();
      section2.scrollIntoView({ behavior: "smooth" });
    });
  }

  const scrollToBook = document.getElementById("scroll-to-book");
  const section3 = document.getElementById("section-3");

  if (scrollToBook && section3) {
    scrollToBook.addEventListener("click", function (e) {
      e.stopPropagation();
      section3.scrollIntoView({ behavior: "smooth" });
    });
  }

  const scrollToFinale = document.getElementById("scroll-to-finale");
  const section4 = document.getElementById("section-4");

  if (scrollToFinale && section4) {
    scrollToFinale.addEventListener("click", function (e) {
      e.stopPropagation();
      section4.scrollIntoView({ behavior: "smooth" });
    });
  }

  // 5. Memory Captions & Modal Lightbox
  const memoryData = [
    { title: "First Glance", date: "The beginning of forever" },
    { title: "Sweet Laughter", date: "Your smile lights up my world" },
    { title: "Unforgettable Days", date: "Every second with you is precious" },
    { title: "Little Moments", date: "It's the small things that mean the most" },
    { title: "Starlight Promise", date: "Holding hands beneath the night sky" },
    { title: "Pure Joy", date: "You make my heart skip a beat" },
    { title: "Our Favorite Place", date: "Anywhere feels like home with you" },
    { title: "Endless Talks", date: "Conversations that last until sunrise" },
    { title: "Warm Embraces", date: "In your arms is where I belong" },
    { title: "Golden Sunshine", date: "Brighter than any summer morning" },
    { title: "Cherished Melody", date: "The sweetest song in my heart" },
    { title: "Forever Dream", date: "Walking through this beautiful life together" },
    { title: "My Safest Space", date: "Thank you for being my anchor" },
    { title: "Pieces of My Heart", date: "Forever and always yours" }
  ];

  const modalOverlay = document.getElementById("modal-overlay");
  const modalImg = document.getElementById("modal-img");
  const modalCaption = document.getElementById("modal-caption");
  const modalSubtext = document.getElementById("modal-subtext");
  const modalClose = document.getElementById("modal-close");

  function openModal(src, title, date, x, y) {
    if (!modalOverlay || !modalImg) return;
    modalImg.src = src;
    if (modalCaption) modalCaption.textContent = title || "";
    if (modalSubtext) modalSubtext.textContent = date || "";
    modalOverlay.classList.add("active");
    modalOverlay.setAttribute("aria-hidden", "false");
    if (x !== undefined && y !== undefined) {
      createHeart(x, y);
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
  }

  // Close button click
  if (modalClose) {
    modalClose.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  // Backdrop tap to close (when clicking outside the modal card)
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        e.stopPropagation();
        closeModal();
      }
    });
  }

  // Escape key to close
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  const frames = document.querySelectorAll(".frame-item");
  frames.forEach((frame, idx) => {
    frame.addEventListener("click", function (e) {
      e.stopPropagation();
      const img = frame.querySelector(".photo-slot img");
      if (img) {
        const info = memoryData[idx % memoryData.length];
        openModal(img.src, info.title, info.date, e.clientX, e.clientY);
      }
    });
  });

  // Paper photo click in section 1 opens modal too!
  const paperPhoto = document.getElementById("paper-photo-wrap");
  if (paperPhoto) {
    paperPhoto.addEventListener("click", function (e) {
      e.stopPropagation();
      const img = paperPhoto.querySelector("img");
      if (img) {
        openModal(img.src, "You & Me", "Made for moments that matter", e.clientX, e.clientY);
      }
    });
  }

  // 6. Section 3: 3D Interactive Keepsake Book ("10 Reasons Why I Love You")
  function init3DBook() {
    const bookContainer = document.getElementById("book-container");
    const leaves = Array.from(document.querySelectorAll(".book-leaf"));
    const prevBtn = document.getElementById("book-prev");
    const nextBtn = document.getElementById("book-next");
    const pageNumEl = document.getElementById("book-page-num");
    const dotsContainer = document.getElementById("book-dots");
    const restartBtn = document.getElementById("book-restart-btn");

    if (!bookContainer || leaves.length === 0) return;

    let currentLeaf = 0; // 0 = Cover, 1..10 = Reasons, 11 = Final
    const totalLeaves = leaves.length;

    // Realistic Web Audio Page Turn Synthesizer
    function playPageTurnSound() {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const bufferSize = Math.floor(audioCtx.sampleRate * 0.16); // 160ms
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const channelData = buffer.getChannelData(0);

        // Soft parchment paper friction noise
        for (let i = 0; i < bufferSize; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.38));
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.16);
        filter.Q.value = 2.0;

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.16);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        noise.start();
      } catch (e) {}
    }

    // Set initial 3D stacking order
    function updateZIndices() {
      leaves.forEach((leaf, idx) => {
        if (idx < currentLeaf) {
          // Flipped to the left
          leaf.style.zIndex = idx + 1;
        } else {
          // Unflipped on the right
          leaf.style.zIndex = totalLeaves - idx;
        }
      });
    }
    updateZIndices();

    // Create Navigation Progress Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      leaves.forEach((_, idx) => {
        const dot = document.createElement("div");
        dot.className = "book-dot" + (idx === 0 ? " active" : "");
        dot.dataset.index = idx;
        dot.addEventListener("click", () => goToPage(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateUI() {
      const pageSubEl = document.getElementById("book-page-sub");

      // Update page indicator badge
      if (pageNumEl) {
        if (currentLeaf === 0) {
          pageNumEl.textContent = "Book Cover";
          if (pageSubEl) pageSubEl.textContent = "Tap or Swipe to Open";
        } else if (currentLeaf === 1) {
          pageNumEl.textContent = "Dedication";
          if (pageSubEl) pageSubEl.textContent = "A Promise of Love";
        } else if (currentLeaf >= 2 && currentLeaf <= 11) {
          pageNumEl.textContent = `Reason No. ${currentLeaf - 1}`;
          if (pageSubEl) pageSubEl.textContent = `Chapter ${currentLeaf - 1} of 10`;
        } else {
          pageNumEl.textContent = "Forever Yours";
          if (pageSubEl) pageSubEl.textContent = "The End ♥";
        }
      }

      // Update button disabled state
      if (prevBtn) prevBtn.disabled = (currentLeaf === 0);
      if (nextBtn) nextBtn.disabled = (currentLeaf >= totalLeaves);

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll(".book-dot");
        dots.forEach((dot, idx) => {
          dot.classList.toggle("active", idx === currentLeaf);
        });
      }
    }

    // Flip Forward (turn page left)
    function flipForward() {
      if (currentLeaf >= totalLeaves) return;

      const leafToFlip = leaves[currentLeaf];
      leafToFlip.style.zIndex = 50; // Temporarily elevate while rotating
      leafToFlip.classList.add("flipped");

      playPageTurnSound();
      currentLeaf++;

      setTimeout(() => {
        updateZIndices();
      }, 350);

      updateUI();
    }

    // Flip Backward (turn page right)
    function flipBackward() {
      if (currentLeaf <= 0) return;

      currentLeaf--;
      const leafToUnflip = leaves[currentLeaf];
      leafToUnflip.style.zIndex = 50; // Temporarily elevate while rotating
      leafToUnflip.classList.remove("flipped");

      playPageTurnSound();

      setTimeout(() => {
        updateZIndices();
      }, 350);

      updateUI();
    }

    // Go directly to target page
    function goToPage(target) {
      if (target === currentLeaf) return;
      if (target > currentLeaf) {
        const diff = target - currentLeaf;
        for (let i = 0; i < diff; i++) {
          setTimeout(() => flipForward(), i * 140);
        }
      } else {
        const diff = currentLeaf - target;
        for (let i = 0; i < diff; i++) {
          setTimeout(() => flipBackward(), i * 140);
        }
      }
    }

    // Button event listeners
    if (nextBtn) nextBtn.addEventListener("click", flipForward);
    if (prevBtn) prevBtn.addEventListener("click", flipBackward);

    if (restartBtn) {
      restartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        goToPage(0);
      });
    }

    // Click on Book Container: Right side flips next, Left side flips prev
    bookContainer.addEventListener("click", function (e) {
      // Don't trigger if clicking an internal button like restart
      if (e.target.closest("button")) return;

      const rect = bookContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX > rect.width * 0.45) {
        flipForward();
      } else {
        flipBackward();
      }
    });

    // Touch and Pointer Swipe Gesture Detection
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;

    bookContainer.addEventListener("touchstart", function (e) {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
      isSwiping = true;
    }, { passive: true });

    bookContainer.addEventListener("touchmove", function (e) {
      if (!isSwiping) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      // If horizontal swipe is clearer than vertical scroll, prevent page bounce
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });

    bookContainer.addEventListener("touchend", function (e) {
      if (!isSwiping) return;
      isSwiping = false;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const elapsed = Date.now() - touchStartTime;

      // Swipe threshold: distance > 35px or quick flick
      if (Math.abs(dx) > Math.abs(dy) * 1.2 && (Math.abs(dx) > 35 || (Math.abs(dx) > 20 && elapsed < 250))) {
        if (dx < 0) {
          flipForward(); // Swiped left -> next page
        } else {
          flipBackward(); // Swiped right -> prev page
        }
      }
    }, { passive: true });

    // Keyboard navigation (Left / Right arrow keys)
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") flipForward();
      if (e.key === "ArrowLeft") flipBackward();
    });

    updateUI();
  }

  // 7. Section 4: Polaroid Valentine Proposal Finale (Exact Reference Match)
  function initValentineProposal() {
    const frame = document.getElementById("polaroid-frame");
    const btnYes = document.getElementById("btn-oval-yes");
    const btnNo = document.getElementById("btn-oval-no");
    const btnRelive = document.getElementById("btn-relive-story");
    const section1 = document.getElementById("section-1");

    if (!frame || !btnYes || !btnNo) return;

    // Celebration Audio Chime Synthesizer
    function playCelebrationChimes() {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        // Elegant ascending crystal harp glissando: C5, E5, G5, B5, C6, E6
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const start = audioCtx.currentTime + idx * 0.08;

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.18, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(start);
          osc.stop(start + 0.65);
        });
      } catch (e) {}
    }

    // Celebration Rose Petal & Gold Star Rain
    function spawnCelebrationRain() {
      const items = ["🌸", "🌹", "♥", "✨", "✦", "💖", "🌷"];
      const colors = ["#e27d89", "#c98a8a", "#d4af37", "#f3b0b8", "#99C6E3"];

      for (let i = 0; i < 45; i++) {
        setTimeout(() => {
          const petal = document.createElement("div");
          petal.className = "celebration-petal";
          petal.textContent = items[Math.floor(Math.random() * items.length)];
          petal.style.left = (Math.random() * 92 + 4) + "vw";
          petal.style.top = "-20px";
          petal.style.fontSize = (16 + Math.random() * 18) + "px";
          petal.style.color = colors[Math.floor(Math.random() * colors.length)];

          const dur = (2.2 + Math.random() * 2.5) + "s";
          const sway = ((Math.random() - 0.5) * 160) + "px";
          const rot = (Math.random() * 720 - 360) + "deg";

          petal.style.setProperty("--dur", dur);
          petal.style.setProperty("--sway", sway);
          petal.style.setProperty("--rot", rot);

          document.body.appendChild(petal);
          setTimeout(() => petal.remove(), 5000);
        }, i * 70);
      }
    }

    // Playful Runaway NO button logic
    const runawayReplies = [
      "no",
      "wait!",
      "nope!",
      "try again",
      "yes? ♥",
      "hehe 🏃‍♂️",
      "no way 😉"
    ];
    let replyIdx = 0;

    function dodgeNoButton(e) {
      if (e) e.preventDefault();
      
      const maxDistanceX = 70;
      const maxDistanceY = 40;
      const randX = (Math.random() * 2 - 1) * maxDistanceX;
      const randY = (Math.random() * 2 - 1) * maxDistanceY;

      replyIdx = (replyIdx + 1) % runawayReplies.length;
      const textSpan = btnNo.querySelector(".oval-text");
      if (textSpan) textSpan.textContent = runawayReplies[replyIdx];

      btnNo.style.transform = `translate(${randX}px, ${randY}px) scale(0.96)`;
      
      // Light playful snap sound
      if (typeof playTypewriterClick === "function") playTypewriterClick();
    }

    btnNo.addEventListener("mouseenter", dodgeNoButton);
    btnNo.addEventListener("pointerdown", dodgeNoButton);
    btnNo.addEventListener("click", dodgeNoButton);

    // YES Button Click
    btnYes.addEventListener("click", function (e) {
      e.stopPropagation();
      frame.classList.add("is-celebrating");
      playCelebrationChimes();
      spawnCelebrationRain();
      
      // Spawn extra hearts at click
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          createHeart(e.clientX + (Math.random() - 0.5) * 60, e.clientY + (Math.random() - 0.5) * 60);
        }, i * 40);
      }
    });

    // Relive Story (smooth scroll back to top)
    if (btnRelive && section1) {
      btnRelive.addEventListener("click", function (e) {
        e.stopPropagation();
        section1.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  init3DBook();
  initValentineProposal();
});


