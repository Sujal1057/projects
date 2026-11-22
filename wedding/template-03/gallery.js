// Royale - the photo gallery.
//
// Every frame hangs from the rail on its cords, and scrolling or dragging the rail sways
// each one like a pendulum with its own length, stiffness and damping, so
// they swing out of step. A frame also twists on its cords - lagging the
// rail the same way, plus a slow idle turn - and it is that twist that shows
// the depth of the frame's 3D box (styles.css "gallery").
(function () {
  'use strict';

  var scroller = document.getElementById('ryGalleryScroll');
  if (!scroller) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Per-frame physics. A longer cord (--hang) swings more slowly.
  var frames = Array.prototype.map.call(scroller.querySelectorAll('.gframe'), function (el, i) {
    var hang = parseFloat(el.style.getPropertyValue('--hang')) || 110;
    return {
      el: el,
      body: el.querySelector('.gframe__body'),
      angle: 0,
      vel: 0,
      yaw: 0,
      yawVel: 0,
      stiffness: 0.02 * (130 / (hang + 90)),
      damping: 0.93 + (i % 3) * 0.01,
      gain: 0.55 + ((i * 7) % 5) * 0.08,
      idleAmp: 0.5 + (i % 2) * 0.35,
      idleYawAmp: 6 + (i % 3) * 1.5,
      idleFreq: 0.4 + ((i * 3) % 4) * 0.1,
      idlePhase: i * 1.7,
      last: '',
      lastYaw: '',
    };
  });

  var MAX_ANGLE = 20;
  var MAX_YAW = 26;

  function clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }

  var lastScroll = scroller.scrollLeft;
  var vSmooth = 0;
  var rafId = null;
  var inView = false;

  function frame(now) {
    var t = now / 1000;

    // Scroll velocity (px/frame), smoothed.
    var sl = scroller.scrollLeft;
    vSmooth += ((sl - lastScroll) - vSmooth) * 0.35;
    lastScroll = sl;

    frames.forEach(function (f) {
      // Swing: the frame lags the rail's motion, then springs back.
      var equil = clamp(vSmooth * 0.85 * f.gain, -MAX_ANGLE, MAX_ANGLE);
      f.vel += (equil - f.angle) * f.stiffness;
      f.vel *= f.damping;
      f.angle += f.vel;

      // Twist: the same lag about the cords' axis, a little livelier.
      var yawEquil = clamp(-vSmooth * 1.1 * f.gain, -MAX_YAW, MAX_YAW);
      f.yawVel += (yawEquil - f.yaw) * f.stiffness * 1.4;
      f.yawVel *= f.damping;
      f.yaw += f.yawVel;

      var idle = Math.sin(t * f.idleFreq + f.idlePhase) * f.idleAmp;
      var idleYaw = Math.sin(t * f.idleFreq * 0.8 + f.idlePhase + 1.3) * f.idleYawAmp;

      // Skip writes that round to what is already there.
      var next = 'rotate(' + (f.angle + idle).toFixed(3) + 'deg)';
      if (next !== f.last) {
        f.el.style.transform = next;
        f.last = next;
      }
      var nextYaw = 'rotateY(' + (f.yaw + idleYaw).toFixed(2) + 'deg)';
      if (f.body && nextYaw !== f.lastYaw) {
        f.body.style.transform = nextYaw;
        f.lastYaw = nextYaw;
      }
    });

    rafId = requestAnimationFrame(frame);
  }

  // ---- run only while the gallery is on screen ------------------------------
  function start() {
    if (rafId !== null || reduceMotion) return;
    // Resync first: a stale lastScroll would read as one huge velocity spike
    // and fling every frame to its limit.
    lastScroll = scroller.scrollLeft;
    vSmooth = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId === null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  function sync() {
    if (inView && !document.hidden) start();
    else stop();
  }

  if ('IntersectionObserver' in window) {
    // A generous margin, so the frames are already moving when they arrive.
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      sync();
    }, { rootMargin: '300px 0px' }).observe(scroller);
  } else {
    inView = true;
    sync();
  }

  document.addEventListener('visibilitychange', sync);

  // ---- hide the hint once the rail has moved --------------------------------
  var hint = document.getElementById('ryGalleryHint');
  if (hint) {
    var hideHint = function () {
      if (scroller.scrollLeft > 8) {
        hint.classList.add('is-hidden');
        scroller.removeEventListener('scroll', hideHint);
      }
    };
    scroller.addEventListener('scroll', hideHint, { passive: true });
  }

  // ---- drag with a mouse (touch keeps native momentum scrolling) ------------
  var dragging = false;
  var startX = 0;
  var startScroll = 0;

  scroller.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    // Not when the press lands on something inside a frame that wants the
    // pointer itself: the editing controls above each frame, and the picture
    // (tap to choose it, drag to reframe, pinch to zoom - see editor.js).
    // setPointerCapture below retargets every later pointer event to the
    // scroller, including the pointerup, and the browser then fires no click
    // on the button at all - which is why the arrows and the x did nothing
    // while the gallery was in edit mode.
    if (e.target.closest && e.target.closest('[data-action], [data-adjust], .ry-frame-controls')) return;
    dragging = true;
    startX = e.clientX;
    startScroll = scroller.scrollLeft;
    scroller.classList.add('is-dragging');
    scroller.setPointerCapture(e.pointerId);
  });

  scroller.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    scroller.scrollLeft = startScroll - (e.clientX - startX);
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    scroller.classList.remove('is-dragging');
    try { scroller.releasePointerCapture(e.pointerId); } catch (_) { /* already released */ }
  }

  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
})();
