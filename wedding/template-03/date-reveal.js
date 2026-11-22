// Royale - the date reveal.
//
// Three plaques that stay empty until the guest presses "Reveal the Date",
// then roll like dials and settle on the wedding date - day, then month, then
// year (see "date reveal" in styles.css).
//
// The date is the section's data-date, YYYY-MM-DD.
(function () {
  'use strict';

  var section = document.getElementById('ryDateReveal');
  if (!section) return;

  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  var when = resolveDate(section.getAttribute('data-date'));
  var btn = document.getElementById('ryRevealBtn');
  var after = document.getElementById('ryRevealAfter');
  var said = document.getElementById('ryRevealSaid');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var spent = false;
  if (btn) btn.addEventListener('click', run);

  // ---- the reveal -----------------------------------------------------------

  function run() {
    // Once per visit - a refresh brings the empty plaques back.
    if (spent) return;
    spent = true;

    section.classList.add('is-revealing');
    if (btn) {
      btn.classList.add('is-pressed');
      btn.disabled = true;
      window.setTimeout(function () { btn.classList.remove('is-pressed'); }, 180);
    }

    if (reduced) {
      // No roll: the values fade in, in the same date -> month -> year order.
      settleAll();
      announce();
      window.setTimeout(finish, 90 + 2 * 260 + 420);
      return;
    }

    // All three start together and the later ones simply run longer, which
    // is how a real set of dials behaves.
    roll('day', dayCells(), 2, 1750);
    roll('month', monthCells(), 2, 2250);
    roll('year', yearCells(), 2, 2750);

    // The gold goes up the moment the last dial lands, and the plaques knock
    // just behind it - so they jump at the burst rather than having quietly
    // settled one at a time on the way there.
    window.setTimeout(function () {
      confetti();
      knock();
    }, 2750);

    window.setTimeout(function () {
      finish();
      announce();
    }, 2750 + 420);
  }

  // ---- the confetti --------------------------------------------------------

  // The three beads the burst is made of - one flat, two that catch the
  // light differently, so a handful never looks stamped out.
  var BEADS = ['media/confetti1.svg', 'media/confetti2.svg', 'media/confetti3.svg'];

  // Fetched now rather than at the press, so the first beads are not blank.
  BEADS.forEach(function (src) { (new Image()).src = src; });

  /**
   * A handful of gold thrown up out of each elephant's howdah as the date
   * lands. Every bead is three nested elements - one to drift sideways, one
   * to carry the arc, one to tumble - because three motions sharing a single
   * transform is what makes confetti turn corners. Each throw is written into
   * custom properties, so the animation itself is the stylesheet's (see
   * ry-flake-drift and its neighbours) and nothing here runs per frame. The
   * layer takes itself away afterwards.
   */
  function confetti() {
    if (reduced) return;
    var stage = section.querySelector('.royale-date__stage');
    var elephants = section.querySelectorAll('.royale-date__elephant');
    if (!stage || !elephants.length) return;

    var layer = document.createElement('div');
    layer.className = 'royale-date__confetti';
    layer.setAttribute('aria-hidden', 'true');
    stage.appendChild(layer);

    var box = stage.getBoundingClientRect();
    // Sizes and distances in hundredths of the stage, so the burst is the
    // same shape on a phone as on a desktop.
    var unit = box.width / 100;

    Array.prototype.forEach.call(elephants, function (el) {
      var r = el.getBoundingClientRect();
      var left = el.classList.contains('royale-date__elephant--left');
      // The howdah rides high on the elephant's back, in from the tail.
      var x = r.left - box.left + r.width * (left ? 0.42 : 0.58);
      var y = r.top - box.top + r.height * 0.08;
      for (var i = 0; i < 26; i++) flake(layer, x, y, left ? 1 : -1, unit);
    });

    window.setTimeout(function () {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 4200);
  }

  function flake(layer, x, y, dir, unit) {
    var el = document.createElement('i');
    var arc = document.createElement('i');
    var bead = document.createElement('img');
    var rand = function (lo, hi) { return lo + Math.random() * (hi - lo); };
    // The drawing carries its own shadow, so the bead itself is about
    // two thirds of the box.
    var w = rand(1.6, 3.1) * unit;

    el.className = 'ryd-flake';
    arc.className = 'ryd-flake__arc';
    bead.className = 'ryd-flake__bead';
    bead.src = BEADS[(Math.random() * BEADS.length) | 0];
    bead.alt = '';

    el.style.left = x.toFixed(1) + 'px';
    el.style.top = y.toFixed(1) + 'px';
    el.style.setProperty('--w', w.toFixed(1) + 'px');
    // Thrown up and inward, then carried on out and down.
    el.style.setProperty('--dx', ((rand(6, 30) * dir + rand(-6, 6)) * unit).toFixed(1) + 'px');
    el.style.setProperty('--rise', (-rand(12, 30) * unit).toFixed(1) + 'px');
    el.style.setProperty('--fall', (rand(10, 30) * unit).toFixed(1) + 'px');
    el.style.setProperty('--rot', (rand(-540, 540) | 0) + 'deg');
    el.style.setProperty('--dur', rand(2200, 3400).toFixed(0) + 'ms');
    el.style.setProperty('--delay', rand(0, 420).toFixed(0) + 'ms');

    arc.appendChild(bead);
    el.appendChild(arc);
    layer.appendChild(el);
  }

  function finish() {
    section.classList.remove('is-revealing');
    section.classList.add('is-revealed');
    if (after) after.hidden = false;
  }

  /**
   * Build one dial's strip and roll it. `loops` decoy passes go in front of
   * the real value, which is the last cell - so the roll always ends on it.
   * The strip is written here, at press time, so before the press the window
   * genuinely holds nothing.
   */
  function roll(name, cells, loops, duration) {
    var plaque = section.querySelector('[data-dial="' + name + '"]');
    var strip = plaque && plaque.querySelector('[data-strip]');
    if (!strip) return;

    var seq = [''];
    for (var l = 0; l < loops; l++) seq = seq.concat(cells.all);
    seq = seq.concat(cells.all.slice(0, cells.index + 1));

    strip.innerHTML = seq.map(cell).join('');

    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0)';
    // Commit the start position before arming the transition, or the two
    // writes coalesce and nothing moves.
    void strip.offsetHeight;

    strip.style.transition = 'transform ' + duration + 'ms cubic-bezier(0.16, 1, 0.3, 1)';
    strip.style.transform = 'translateY(calc(' + (-(seq.length - 1)) + ' * var(--cell-h)))';
  }

  /** The hop the three plaques give as the gold goes up, left to right. */
  function knock() {
    ['day', 'month', 'year'].forEach(function (name, i) {
      var plaque = section.querySelector('[data-dial="' + name + '"]');
      if (!plaque) return;
      window.setTimeout(function () {
        plaque.classList.add('is-set');
        window.setTimeout(function () { plaque.classList.remove('is-set'); }, 420);
      }, 90 + i * 90);
    });
  }

  /** Every plaque straight onto its value, fading in one after another. */
  function settleAll() {
    [['day', dayCells()], ['month', monthCells()], ['year', yearCells()]]
      .forEach(function (pair, i) {
        var plaque = section.querySelector('[data-dial="' + pair[0] + '"]');
        var strip = plaque && plaque.querySelector('[data-strip]');
        if (!strip) return;
        strip.innerHTML = cell(pair[1].all[pair[1].index]);
        plaque.classList.add('is-fading');
        window.setTimeout(function () { plaque.classList.add('is-shown'); }, 90 + i * 260);
      });
  }

  function announce() {
    if (said) said.textContent = when.day + ' ' + MONTHS_LONG[when.month - 1] + ' ' + when.year;
  }

  // ---- dial contents --------------------------------------------------------

  function cell(value) {
    return '<span class="royale-date__cell">' + value + '</span>';
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function dayCells() {
    var all = [];
    for (var d = 1; d <= 31; d++) all.push(pad(d));
    return { all: all, index: when.day - 1 };
  }

  function monthCells() {
    return { all: MONTHS.slice(), index: when.month - 1 };
  }

  /** Years around the real one, so the dial has somewhere to travel. */
  function yearCells() {
    var all = [];
    for (var y = when.year - 4; y <= when.year + 3; y++) all.push(String(y));
    return { all: all, index: all.indexOf(String(when.year)) };
  }

  // ---- the date -------------------------------------------------------------

  function resolveDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (m) return { year: +m[1], month: +m[2], day: +m[3] };

    var d = new Date();
    d.setDate(d.getDate() + 15);
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }
})();
