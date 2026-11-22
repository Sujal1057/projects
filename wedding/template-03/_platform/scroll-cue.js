// Scroll cue - fades the hero's "Scroll down" in, and out
// again for good once the guest scrolls. Styling and markup: scroll-cue.css.
//
// A template whose hero starts behind a cover ("Tap to open") marks its cue
// data-after-cover, and dispatches 'royale:cover-open' on document once that
// cover is out of the way.
(function () {
  var cues = Array.prototype.slice.call(document.querySelectorAll('.scroll-cue'));
  if (!cues.length) return;

  // Past this, the guest has found the rest of the page - the cue's job is done.
  var SCROLLED = 60;

  function gone() {
    if (window.scrollY <= SCROLLED) return false;
    cues.forEach(function (c) { c.classList.add('is-gone'); });
    window.removeEventListener('scroll', gone);
    return true;
  }
  window.addEventListener('scroll', gone, { passive: true });

  cues.forEach(function (cue) {
    var delay = parseInt(cue.getAttribute('data-delay'), 10) || 0;
    function show() {
      window.setTimeout(function () {
        if (!gone()) cue.classList.add('is-shown');
      }, delay);
    }
    if (cue.hasAttribute('data-after-cover')) {
      document.addEventListener('royale:cover-open', show, { once: true });
    } else {
      show();
    }
  });
})();
