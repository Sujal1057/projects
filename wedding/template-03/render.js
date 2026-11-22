// Royale - drawing the invitation from its config.
(function () {
  const RY = window.Royale;
  if (!RY) return;

  const cfg = RY.config;
  const esc = RY.esc;
  const $ = (id) => document.getElementById(id);

  function renderNames() {
    const b = $('ryBrideName');
    const g = $('ryGroomName');
    if (b) b.textContent = cfg.brideName;
    if (g) g.textContent = cfg.groomName;
    document.title = (cfg.brideName + ' & ' + cfg.groomName + ' - Wedding Invitation').trim();
  }

  function renderInvocation() {
    const card = $('ryGateCard');
    if (!card) return;

    const sym = RY.symbolById(cfg.invocation && cfg.invocation.symbol);
    const symEl = $('ryInvocationSymbol');
    if (symEl) {
      symEl.hidden = !sym.src;
      if (sym.src) {
        symEl.style.setProperty('--symbol-src', 'url("' + sym.src + '")');
      }
    }

    const lines = RY.invocationLines(cfg.invocation);
    const textEl = $('ryInvocationText');
    if (textEl) {
      textEl.textContent = lines.text || '';
      textEl.hidden = lines.isBlank || !lines.text;
      textEl.style.fontFamily = lines.font ? '"' + lines.font + '", var(--font-devanagari)' : '';
    }
  }

  function guestHtml() {
    const name = RY.guestName();
    if (!name) return '';
    return '<span class="royale-card__to">To ' + esc(name) + '</span>';
  }

  function renderGateCard() {
    renderInvocation();
    const note = $('ryIntroNote');
    if (note) note.textContent = cfg.introNote;
    const greet = $('ryGuestGreeting');
    if (greet) {
      const html = guestHtml();
      greet.innerHTML = html;
      greet.hidden = !html;
    }
  }

  function renderFamily(id, key, family) {
    const card = $(id);
    if (!card) return;
    const on = family && family.enabled !== false;
    card.hidden = !on;
    if (!on) return;

    const p = id === 'ryGroomCard' ? 'ryGroom' : 'ryBride';
    const name = $(p + 'CardName'); if (name) name.textContent = family.name;
    const rel = $(p + 'RelLabel'); if (rel) rel.textContent = family.relLabel;
    const pA = $(p + 'ParentA'); if (pA) pA.textContent = family.parentA;
    const pB = $(p + 'ParentB'); if (pB) pB.textContent = family.parentB;
    const gL = $(p + 'GrandLabel'); if (gL) gL.textContent = family.grandLabel;
    const gA = $(p + 'GrandA'); if (gA) gA.textContent = family.grandA;
    const gB = $(p + 'GrandB'); if (gB) gB.textContent = family.grandB;

    const pJ = $(p + 'ParentJoin');
    if (pJ) {
      pJ.textContent = family.parentJoin || '&';
      pJ.style.display = family.parentA && family.parentB ? '' : 'none';
    }
    const gJ = $(p + 'GrandJoin');
    if (gJ) {
      gJ.textContent = family.grandJoin || '&';
      gJ.style.display = family.grandA && family.grandB ? '' : 'none';
    }
  }

  function renderFamilies() {
    renderFamily('ryGroomCard', 'groomFamily', cfg.groomFamily);
    renderFamily('ryBrideCard', 'brideFamily', cfg.brideFamily);
  }

  function renderDate() {
    const section = $('ryDateReveal');
    if (section) section.setAttribute('data-date', cfg.eventISO || '');

    const btn = $('ryRevealBtn');
    const btnLabel = btn && btn.querySelector('.ry-plaque__label');
    if (btnLabel) btnLabel.textContent = cfg.revealButton || 'Reveal the Date';
    const after = $('ryRevealAfter');
    if (after) after.textContent = cfg.revealAfter || 'Save the Date';
  }

  function frameHtml(item, i) {
    const type = item.type === 'story' ? 'story' : item.type === 'landscape' ? 'landscape' : 'portrait';
    const head =
      '<div class="gframe gframe--' + type + '" style="--hang: ' + (+item.hang || 110) + 'px;">' +
      '<span class="gframe__hook" aria-hidden="true"></span>' +
      '<svg class="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path d="M50 0L0 100M50 0L100 100" /><path class="gframe__twist" d="M50 0L0 100M50 0L100 100" /></svg>' +
      '<div class="gframe__body">' +
      '<span class="gframe__crest" aria-hidden="true"></span>' +
      '<span class="gframe__corner gframe__corner--tl" aria-hidden="true"></span>' +
      '<span class="gframe__corner gframe__corner--tr" aria-hidden="true"></span>' +
      '<span class="gframe__corner gframe__corner--bl" aria-hidden="true"></span>' +
      '<span class="gframe__corner gframe__corner--br" aria-hidden="true"></span>' +
      '<div class="gframe__rim">' +
      '<div class="gframe__bevel">' +
      '<div class="gframe__lip">';

    const tail = '</div></div></div></div>';

    if (type === 'story') {
      return head +
        '<div class="gframe__mat gframe__story">' +
        '<p>' + RY.nl2br(item.text || '') + '</p>' +
        '</div>' + tail;
    }

    const img = (item.image || '').trim();
    const zoom = Math.min(3, Math.max(1, +item.zoom || 1));
    const px = Number.isFinite(+item.posX) ? Math.min(100, Math.max(0, +item.posX)) : 50;
    const py = Number.isFinite(+item.posY) ? Math.min(100, Math.max(0, +item.posY)) : 50;
    const imgTag = img
      ? '<img class="gframe__img" src="' + esc(img) + '" alt="" draggable="false" ' +
        'data-zoom="' + zoom + '" data-pos-x="' + px + '" data-pos-y="' + py + '">'
      : '';

    const photo = '<div class="gframe__photo">' + imgTag +
      (img ? '' : '<span class="gframe__placeholder">Our Photo</span>') + '</div>';

    return head +
      '<figure class="gframe__mat">' +
      photo +
      '<figcaption class="gframe__caption">' + esc(item.caption || '') + '</figcaption>' +
      '</figure>' + tail;
  }

  function frameImage(el) {
    const box = el && el.parentElement;
    if (!box) return null;
    const bw = box.clientWidth, bh = box.clientHeight;
    const nw = el.naturalWidth, nh = el.naturalHeight;
    if (!bw || !bh || !nw || !nh) return null;

    const min = Math.min(1, +el.dataset.zoomMin || 1);
    const zoom = Math.min(3, Math.max(min, +el.dataset.zoom || 1));
    const fit = Math.max(bw / nw, bh / nh) * zoom;
    const w = nw * fit, h = nh * fit;
    el.style.width = w + 'px';
    el.style.height = h + 'px';

    const spareX = w - bw, spareY = h - bh;
    const x = Number.isFinite(+el.dataset.posX) ? +el.dataset.posX : 50;
    const y = Number.isFinite(+el.dataset.posY) ? +el.dataset.posY : 50;
    el.style.transform = 'translate(' + (-(x / 100) * spareX) + 'px,' +
                                        (-(y / 100) * spareY) + 'px)';
    return { ovX: Math.max(0, spareX / 2), ovY: Math.max(0, spareY / 2) };
  }

  function frameImages(root) {
    (root || document).querySelectorAll('.gframe__img').forEach((el) => {
      if (el.complete && el.naturalWidth) frameImage(el);
      else el.addEventListener('load', () => frameImage(el), { once: true });
    });
  }

  window.addEventListener('resize', () => frameImages());

  function renderGallery() {
    const section = document.querySelector('.royale-gallery');
    const track = document.querySelector('.royale-gallery__track');
    if (!section || !track) return;

    const items = Array.isArray(cfg.gallery.items) ? cfg.gallery.items : [];
    const on = cfg.gallery.enabled !== false && items.length > 0;
    section.hidden = !on;
    if (!on) return;

    let html = '<div class="royale-gallery__rail" aria-hidden="true"></div>';
    items.forEach((item, i) => { html += frameHtml(item, i); });

    track.innerHTML = html;
    frameImages(track);
  }

  function ceremonyHtml(c, i) {
    const name = (c.name || '').trim();
    const map = RY.mapLink(c);

    return '<article class="ryc-card" data-index="' + i + '">' +
      '<div class="ryc-card__arch" aria-hidden="true">' +
      '<svg class="ryc-card__svg" viewBox="0 0 160 216" preserveAspectRatio="none">' +
      '<use href="#ryCeremonyCardDef" />' +
      '</svg>' +
      '</div>' +
      '<div class="ryc-card__inner">' +
      '<div class="ryc-card__art">' +
      '<img src="' + esc(c.art || '') + '" alt="" loading="lazy" decoding="async">' +
      '</div>' +
      '<div class="ryc-card__body">' +
      '<h3 class="ryc-card__name">' + esc(name) + '</h3>' +
      '<p class="ryc-card__venue">' +
      '<span class="ryc-card__venue-text">' + esc(c.venue || '') + '</span>' +
      (map
        ? '<a class="ryc-card__map-btn" href="' + esc(map) + '" target="_blank" rel="noopener" ' +
          'aria-label="Open location in Google Maps" title="Open location in Google Maps">' +
          '<img src="media/location.svg" alt="" aria-hidden="true" loading="lazy" decoding="async"></a>'
        : '') +
      '</p>' +
      '<p class="ryc-card__when">' +
      '<span class="ryc-card__date">' + esc(RY.fmtDate(c.date)) + '</span>' +
      (RY.fmtTime(c.time) ? '<span class="ryc-card__time">' + esc(RY.fmtTime(c.time)) + '</span>' : '') +
      '</p>' +
      '</div></div></article>';
  }

  function renderCeremonies() {
    const grid = document.querySelector('.ryc-grid');
    if (!grid) return;

    const list = RY.ceremoniesByDate((cfg.ceremonies || []).filter(RY.ceremonyLive));
    let html = '';
    list.forEach((c, i) => {
      html += ceremonyHtml(c, i);
      if (i < list.length - 1) {
        html += '<img class="ryc-divider' + ((i + 1) % 3 === 0 ? ' ryc-divider--row' : '') +
          '" src="media/divider2.png" alt="" aria-hidden="true" loading="lazy" decoding="async">';
      }
    });

    grid.innerHTML = html;
    if (window.RoyaleFitText) window.RoyaleFitText.fit('.ryc-card__name');
  }

  function renderCompliments() {
    const card = $('ryComplimentsCard');
    if (!card) return;
    const comp = cfg.compliments;
    const on = comp && comp.enabled !== false;
    card.hidden = !on;
    if (!on) return;

    const lead = $('ryComplimentLead');
    if (lead) lead.textContent = comp.lead || 'With Best Compliments From:';

    const wrap = $('ryComplimentLines');
    if (!wrap) return;
    const lines = (comp.lines || []).filter((l) => (l || '').trim());
    wrap.innerHTML = lines.map((l) => '<p class="royale-scroll__line">' + esc(l) + '</p>').join('');
  }

  function renderNote() {
    const card = $('ryNoteCard');
    if (!card) return;
    const note = cfg.note;
    const on = note && note.enabled !== false;
    card.hidden = !on;
    if (!on) return;

    const lead = $('ryNoteLead');
    if (lead) lead.textContent = note.lead || 'A Note From Us';
    const text = $('ryNoteText');
    if (text) text.innerHTML = RY.nl2br(note.text || '');
  }

  function renderFarewell() {
    const outro = document.querySelector('.royale-outro');
    if (!outro) return;

    const guestEl = outro.querySelector('.royale-outro__names');
    if (guestEl) {
      const name = RY.guestName();
      guestEl.textContent = name;
      guestEl.hidden = !name;
    }
    const line = outro.querySelector('.royale-outro__line');
    if (line) {
      line.textContent = (cfg.farewell && cfg.farewell.line) || 'Your Presence Means the World to Us';
    }
  }

  function renderSocial() {
    const ig = $('ryIgBtn');
    if (ig) {
      ig.hidden = !(cfg.social && cfg.social.instagram !== false);
    }
  }

  function renderAll() {
    renderNames();
    renderGateCard();
    renderFamilies();
    renderDate();
    renderGallery();
    renderCeremonies();
    renderCompliments();
    renderNote();
    renderFarewell();
    renderSocial();
  }

  document.addEventListener('royale:render', renderAll);
  renderAll();
})();
