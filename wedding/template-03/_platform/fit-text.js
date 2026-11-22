// Shrink-to-one-line for short headings - the ceremony cards' names, in every
// template that has them.
//
// The rule, per heading, measured at the size its stylesheet gives it:
//   - fits on one line          -> left alone
//   - wraps onto exactly two    -> the font comes down just enough to fit it
//                                  on one line, but never below MIN of its
//                                  own size; if that is not enough, it is left
//                                  alone, at its own size, on two lines
//   - three lines or more       -> left alone: a name that long is not
//                                  chased down to an unreadable size
//
// Measured with the browser's own layout (offset sizes, so the cards'
// transforms - the deck's fan, the carousel's scale - never skew it), and
// redone whenever it can change: after a render (the template calls fit()),
// once the web fonts arrive, on resize, and while the host types a name.
(function () {
  if (window.RoyaleFitText) return;

  const MIN = 0.55;
  const selectors = new Set();

  function px(v) {
    return parseFloat(v) || 0;
  }

  // The width a heading may take: its parent's content box, less its own
  // margins. Not the heading's own width - a heading centred in a flex
  // column is only as wide as its text, which says nothing about the room.
  function room(el) {
    const p = el.parentElement;
    if (!p) return 0;
    const ps = getComputedStyle(p);
    const es = getComputedStyle(el);
    return p.clientWidth - px(ps.paddingLeft) - px(ps.paddingRight) - px(es.marginLeft) - px(es.marginRight);
  }

  // The heading's width and height set on one line, at its current size.
  function oneLine(el) {
    const ws = el.style.whiteSpace;
    const w = el.style.width;
    el.style.whiteSpace = 'nowrap';
    el.style.width = 'max-content';
    const size = { w: el.offsetWidth, h: el.offsetHeight };
    el.style.whiteSpace = ws;
    el.style.width = w;
    return size;
  }

  function fitOne(el) {
    el.style.fontSize = '';
    if (!(el.textContent || '').trim() || !el.getClientRects().length) return;

    const avail = room(el);
    const one = oneLine(el);
    if (!avail || !one.h || one.w <= avail + 0.5) return;        // one line

    const lines = Math.round(el.offsetHeight / one.h);
    if (lines !== 2) return;                                     // too long

    const base = px(getComputedStyle(el).fontSize);
    const floor = base * MIN;
    let size = base * (avail / one.w) * 0.98;
    while (size >= floor) {
      el.style.fontSize = size + 'px';
      if (oneLine(el).w <= avail + 0.5) return;                  // fits now
      size *= 0.97;
    }
    el.style.fontSize = '';                                      // can't: two lines it is
  }

  function fit(selector) {
    const list = selector ? [selector] : Array.from(selectors);
    list.forEach((sel) => {
      selectors.add(sel);
      document.querySelectorAll(sel).forEach(fitOne);
    });
  }

  let pending = 0;
  function refitSoon() {
    if (pending) return;
    pending = requestAnimationFrame(() => { pending = 0; fit(); });
  }

  window.addEventListener('resize', refitSoon);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refitSoon);

  // A host typing a name: refit just that heading as it changes.
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    selectors.forEach((sel) => {
      const el = t.closest(sel);
      if (el) fitOne(el);
    });
  });

  window.RoyaleFitText = { fit, MIN };
})();
