// Royale - smooth scrolling, and the scroll-driven decoration (GSAP).
//
// Two things, in the order they are set up: Lenis carries the page itself, so
// a flick glides to a stop instead of jumping, and ScrollTrigger drives the
// pieces that should answer to the scroll - the parallax drifts and the few
// reveals.
//
// Nothing here hides anything on its own: with no GSAP, no Lenis, or
// with reduced motion, the page is exactly what the stylesheet
// draws and scrolls the way the browser scrolls it.
//
// What is deliberately left alone:
//   - the gate and the hero, which have their own opening and whose video
//     gave trouble the last time anything moved it;
//   - the scroll cards, which unroll from app.js, and the ceremony cards,
//     which rise from it - both through IntersectionObserver, which keeps
//     working under Lenis because Lenis scrolls the page for real;
//   - the gallery's frames, which swing on their own physics, and its rail,
//     which scrolls sideways (see the virtualScroll hook below).
// Two systems on one element do not mix: gsap.from() tweens TO whatever the
// element's current values are, so an element another script has already set
// to opacity 0 would be tweened 0 -> 0 and pinned there for good.
(function () {
  'use strict';

  var RY = window.Royale;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  // ---- the glide ---------------------------------------------------------
  // Driven from GSAP's ticker when GSAP is there, so the scrubs below read
  // the same frame Lenis just drew and cannot lag a frame behind it.
  (function smooth() {
    if (typeof Lenis === 'undefined') return;

    // The gallery's rail scrolls sideways. Lenis steps aside only for a
    // gesture that is mostly SIDEWAYS over it (a trackpad swipe, shift+wheel),
    // so the browser scrolls the rail; an up/down wheel over the gallery stays
    // Lenis's and the page glides on through. It used to carry
    // data-lenis-prevent, which made Lenis drop every wheel over the rail - so
    // a smooth scroll down the page stopped dead the moment the cursor reached
    // the gallery, the browser's own unsmoothed scroll took over, and Lenis
    // then snapped to wherever that had left the page: a visible jerk.
    var rail = document.getElementById('ryGalleryScroll');

    var lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      virtualScroll: function (e) {
        if (!rail || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return true;
        return !(e.event && rail.contains(e.event.target));
      },
    });
    window.__lenis = lenis;

    // While the gate is shut the page must not move - the gate's own wheel
    // handler stops the browser, but Lenis listens on the window and would
    // scroll behind it. So it is held until <html> turns .is-open.
    var root = document.documentElement;
    if (!root.classList.contains('is-open')) {
      lenis.stop();
      var watch = new MutationObserver(function () {
        if (!root.classList.contains('is-open')) return;
        lenis.start();
        watch.disconnect();
        if (ScrollTrigger) ScrollTrigger.refresh();
      });
      watch.observe(root, { attributes: true, attributeFilter: ['class'] });
    }

    if (gsap && ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      });
    }
  })();

  // ---- the scroll-driven pieces -----------------------------------------
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var has = function (sel) { return !!document.querySelector(sel); };

  /** Rises into place the first time it is reached, and stays. */
  function reveal(sel, opts) {
    var o = opts || {};
    document.querySelectorAll(sel).forEach(function (el) {
      gsap.from(el, {
        opacity: 0,
        y: o.y || 44,
        duration: o.duration || 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: o.trigger ? document.querySelector(o.trigger) : el, start: o.start || 'top 85%', once: true },
      });
    });
  }

  /** Drifts across the whole time the section is on screen. */
  function drift(sel, from, to, trigger) {
    if (!has(sel)) return;
    gsap.fromTo(sel, from, Object.assign({}, to, {
      ease: 'none',
      scrollTrigger: { trigger: trigger, start: 'top bottom', end: 'bottom top', scrub: true },
    }));
  }

  // The date: the scene arrives as a piece, and the lotus above the plaques
  // rides a little against it as the section passes.
  reveal('.royale-date__stage', { trigger: '.royale-date', start: 'top 80%', y: 40, duration: 1 });
  drift('.royale-date__crown', { yPercent: 6 }, { yPercent: -6 }, '.royale-date');

  // The pavilion between the date and the gallery: the deepest thing on the
  // page, so it moves the most against it. Kept small in its own percentages
  // so a phone's smaller picture drifts proportionally less.
  drift('.royale-pavilion__image', { yPercent: 3 }, { yPercent: -3 }, '.royale-pavilion');

  // The gallery's papered wall slides behind its frames.
  drift('.royale-gallery', { backgroundPositionY: '42%' }, { backgroundPositionY: '58%' }, '.royale-gallery');

  // The ornament laid over the seam, brought up with the wall it hangs on.
  // Opacity only: it carries a translate of its own that holds its gold rule
  // on the seam, and a transform tween here would take that over.
  if (has('.royale-gallery__divider')) {
    gsap.from('.royale-gallery__divider', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.royale-gallery', start: 'top 95%', once: true },
    });
  }

  // The heading over the ceremony cards, which rise on their own.
  reveal('.ryc-title', { y: 32 });

  // The closing garden: the board on its easel comes up out of it. The
  // picture behind it is left still - it is the section's whole height, so
  // moving it would open a strip of bare paper at one end or the other - and
  // so is the board itself, which is centred on the easel with a transform
  // of its own (see the crown in styles.css for what that costs).
  reveal('.royale-outro__easel', { trigger: '.royale-outro', start: 'top 70%', y: 50, duration: 1 });


  // Pictures and fonts land after this runs and move everything below them.
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
