// Royale - the closing garden follows the mouse.
//
// The garden behind the easel drifts the other way from the cursor, which gives the board in
// front of it some depth. The board itself never moves - it is what the
// garden moves against.
//
// The picture is drawn a little larger than its frame (see .royale-outro
// picture in styles.css, which clips it), so there is something to pan into
// and no bare edge can come into view.
//
// GSAP's quickTo eases the follow; without GSAP a plain lerp does the same
// job. Either way it glides rather than snapping to the pointer.
(function () {
  'use strict';

  var RY = window.Royale;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Only where there is a mouse to follow. A touch screen would otherwise
  // carry the overscale below for nothing, which is a crop of the picture
  // paid for an effect it can never show.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var section = document.querySelector('.royale-outro');
  var bg = section && section.querySelector('.royale-outro__image');
  if (!bg) return;

  // How far the garden travels from the middle, and how much bigger than its
  // frame it is drawn. The overscale has to cover the travel twice over (it
  // spills evenly to both sides), which at the smallest phone leaves room to
  // spare: 6% of a 360px picture is 21px a side against a 12px shift.
  var SHIFT = 12;
  var SCALE = 1.06;
  var EASE = 0.06;

  var pos = { x: 0, y: 0 };

  function apply() {
    bg.style.transform =
      'scale(' + SCALE + ') translate3d(' +
      (-pos.x * SHIFT).toFixed(2) + 'px, ' +
      (-pos.y * SHIFT).toFixed(2) + 'px, 0)';
  }

  apply();

  var setX;
  var setY;

  if (window.gsap) {
    var cfg = { duration: 0.9, ease: 'power3.out', onUpdate: apply };
    setX = window.gsap.quickTo(pos, 'x', cfg);
    setY = window.gsap.quickTo(pos, 'y', cfg);
  } else {
    var tx = 0;
    var ty = 0;
    var raf = null;
    var loop = function () {
      pos.x += (tx - pos.x) * EASE;
      pos.y += (ty - pos.y) * EASE;
      apply();
      if (Math.abs(tx - pos.x) > 0.0005 || Math.abs(ty - pos.y) > 0.0005) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
    setX = function (v) { tx = v; if (!raf) raf = requestAnimationFrame(loop); };
    setY = function (v) { ty = v; };
  }

  // -1 at one edge of the section, 1 at the other.
  section.addEventListener('mousemove', function (e) {
    var r = section.getBoundingClientRect();
    setX(((e.clientX - r.left) / r.width - 0.5) * 2);
    setY(((e.clientY - r.top) / r.height - 0.5) * 2);
  });

  section.addEventListener('mouseleave', function () {
    setX(0);
    setY(0);
  });
})();
