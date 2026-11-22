// Royale - opening the gate.
//
// A tap (or Enter/Space) on the gate adds .is-open to <html>, and styles.css
// runs the whole sequence from that one class: the card slides up off the
// screen, the doors swing open like a book, the rectangular flaps behind
// them open after, and the couple's names fade in over the garden.
// All timings live in styles.css; this file only starts the sequence and
// clears the gate away once its last animation has finished.
(function () {
  'use strict';

  var root = document.documentElement;
  var gate = document.getElementById('ryGate');
  if (!gate) return;

  // The animation that ends the gate's part of the sequence: the second flap
  // opening (the last thing in the gate to move) - the bottom one in portrait,
  // the right one in landscape - or with reduced motion the gate's own fade.
  var FINAL_ANIMATIONS = ['ry-flap-bottom', 'ry-flap-right', 'ry-gate-fade'];
  // In case animationend never arrives - e.g. the tab was backgrounded
  // mid-sequence and the browser skipped the event. Comfortably after the
  // flaps' own end (--flap-delay + --flap-dur, 2.85s).
  var FALLBACK_MS = 4500;

  var finished = false;

  function finish() {
    if (finished) return;
    finished = true;

    // Hand keyboard focus on to the names rather than leaving it on an
    // element that is about to disappear.
    var hadFocus = document.activeElement === gate;
    gate.hidden = true;
    // The hero is now in plain view - the shared scroll cue
    // waits on this rather than appearing over the gate.
    document.dispatchEvent(new CustomEvent('royale:cover-open'));
    if (hadFocus) {
      var couple = document.getElementById('ryCouple');
      if (couple) couple.focus({ preventScroll: true });
    }
  }

  function open() {
    if (root.classList.contains('is-open')) return;
    root.classList.add('is-open');
    gate.setAttribute('aria-disabled', 'true');
    // The page behind is not scroll-locked (see .royale-gate in styles.css),
    // so make sure the reveal starts from the top of the hero.
    window.scrollTo(0, 0);
    // The hero video (below) starts from its first frame on this.
    document.dispatchEvent(new CustomEvent('royale:gate-open'));

    gate.addEventListener('animationend', function (e) {
      if (FINAL_ANIMATIONS.indexOf(e.animationName) !== -1) finish();
    });
    window.setTimeout(finish, FALLBACK_MS);
  }

  // The wheel counterpart of the gate's touch-action:none - keeps the page
  // behind a closed gate from scrolling out from under it.
  gate.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });

  gate.addEventListener('click', open);
  gate.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
})();

// Royale - the hero video.
//
// Only a phone's: below 700px the hero is the moving garden, and from there
// up a still takes its place (see "hero" in styles.css). The source and
// poster are set only while the phone query matches, so a wider screen never
// fetches the video, and it is fetched if the window narrows past 700px. It
// is muted.
//
// Playing starts from the first frame as the gate opens, so the guest sees
// it from the beginning rather than wherever an unseen loop had got to, and
// pauses whenever the hero is off screen, the tab is hidden or the still is
// showing. With reduced motion it never plays: the poster (that same first
// frame) stays.
(function () {
  'use strict';

  var video = document.getElementById('ryHeroVideo');
  if (!video) return;

  var phone = window.matchMedia(video.getAttribute('data-from') || '(max-width: 699px)');

  function source() {
    if (phone.matches && !video.getAttribute('src')) {
      video.poster = video.getAttribute('data-poster');
      video.src = video.getAttribute('data-src');
    }
    sync();
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var started = false;
  var inView = true;

  function play() {
    // A browser can still refuse (a data saver, low-power mode): the poster
    // simply stays up, so there is nothing to recover from.
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  function sync() {
    if (!reduced && started && inView && phone.matches && !document.hidden && video.getAttribute('src')) play();
    else video.pause();
  }

  source();
  // Safari before 14 has no addEventListener on a media query list.
  if (phone.addEventListener) phone.addEventListener('change', source);
  else if (phone.addListener) phone.addListener(source);

  if (reduced) return;

  document.addEventListener('royale:gate-open', function () {
    started = true;
    try { video.currentTime = 0; } catch (_) { /* not seekable yet - it is at 0 anyway */ }
    sync();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      sync();
    }).observe(video.parentNode);
  }

  document.addEventListener('visibilitychange', sync);
})();

// Royale - the scrolls (the family cards, and the compliments and note cards).
//
// Arms every scroll (which closes it - see "scroll cards" in styles.css) and
// unrolls each one the first time enough of it is on screen. Closing them
// from here rather than in CSS means that with no script, no
// IntersectionObserver or reduced motion, the cards simply show open.
(function () {
  'use strict';

  var scrolls = document.querySelectorAll('.royale-scroll');
  if (!scrolls.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Everything the card has a picture of. The writing is text and is there
  // from the start; these are not.
  function pictures(scroll) {
    return Array.prototype.slice.call(
      scroll.querySelectorAll('.royale-scroll__sheet img, .royale-scroll__bloom'));
  }

  // ...but only what is ON the sheet has to be ready before it is revealed.
  // The bloom is behind the sheet and is covered as the scroll unrolls over
  // it, so holding the card shut for it would be waiting on something the
  // guest is about to stop being able to see.
  function sheetPictures(scroll) {
    return Array.prototype.slice.call(
      scroll.querySelectorAll('.royale-scroll__sheet img'));
  }

  // The rolls are a 579-byte SVG and load with the page; the card's own
  // pictures are lazy and weigh most of a megabyte between them. Left alone,
  // the two arrive at quite different times and the scroll unrolls to reveal
  // a card that is not there yet - the roll comes down, and the card appears
  // afterwards. So the pictures are woken two screens out, long before the
  // card is anywhere near unrolling.
  function wake(scroll) {
    pictures(scroll).forEach(function (img) {
      if (img.loading === 'lazy') img.loading = 'eager';
    });
  }

  // Loaded AND decoded - decode() is the difference between a picture that
  // has arrived and one that can be painted this frame, which is the thing
  // that matters when an animation is about to reveal it. Failures resolve
  // too: a picture that will never come must not hold the card shut for good.
  function ready(scroll) {
    return Promise.all(sheetPictures(scroll).map(function (img) {
      if (img.decode) return img.decode().catch(function () {});
      if (img.complete) return Promise.resolve();
      return new Promise(function (settle) {
        img.addEventListener('load', settle, { once: true });
        img.addEventListener('error', settle, { once: true });
      });
    }));
  }

  // ...and nor must a stalled network. Past this, unroll regardless: a card
  // that opens onto a half-drawn sheet still beats one that never opens.
  function noLongerThan(promise, ms) {
    return Promise.race([
      promise,
      new Promise(function (settle) { window.setTimeout(settle, ms); }),
    ]);
  }

  var early = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      wake(entry.target);
      early.unobserve(entry.target);
    });
  }, { rootMargin: '200% 0px' });

  // A third of a card on screen: the closed rolls sit at the top of the space
  // the card reserves, so by then they are well in view before they drop.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var scroll = entry.target;
      observer.unobserve(scroll);
      wake(scroll);   // in case it came into view faster than the early pass
      noLongerThan(ready(scroll), 2500).then(function () {
        scroll.classList.add('is-unrolled');
      });
    });
  }, { threshold: 0.35 });

  Array.prototype.forEach.call(scrolls, function (scroll) {
    scroll.classList.add('is-armed');
    early.observe(scroll);
    observer.observe(scroll);
  });
})();

// Royale - the ceremony cards.
//
// The same idea as the scrolls above: arm each card (which lowers and fades
// it - see "ceremonies" in styles.css) and let it rise the first time it is
// on screen. Armed from here rather than in CSS so that with no script, no
// IntersectionObserver or reduced motion the cards simply stand there.
//
// --i is the card's place in its row, which the three-across layout uses to
// bring them in one after another; stacked one per row on a phone, each card
// arrives on its own as it is reached, so the stylesheet ignores it there.
(function () {
  'use strict';

  var cards = document.querySelectorAll('.ryc-card');
  if (!cards.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // A quarter of a card: enough of it is up for the rise to be seen, on a
  // phone card that fills the screen as well as on three across a desktop.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-shown');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  Array.prototype.forEach.call(cards, function (card, i) {
    card.classList.add('is-armed');
    card.style.setProperty('--i', i % 3);
    observer.observe(card);
  });
})();
