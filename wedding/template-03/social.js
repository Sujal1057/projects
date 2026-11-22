// The media row at the foot of the invitation: Instagram, ceremony locations,
// and add-to-calendar. Offers popups for locations and .ics / Google / Outlook calendar integration.
//
// The date/time/map helpers are borrowed from config.js via RY rather than
// reimplemented, so a popup can never format a ceremony differently from the
// card it came from.
(function () {
  var RY = window.Royale;
  if (!RY) return;

  var modal = document.getElementById('ryModal');
  var content = document.getElementById('ryModalContent');
  var igBtn = document.getElementById('ryIgBtn');
  var locBtn = document.getElementById('ryLocBtn');
  var calBtn = document.getElementById('ryCalBtn');
  if (!modal || !content) return;

  var esc = RY.esc;

  // ---- The ceremonies these popups describe --------------------------------
  // Only the ones guests see on the cards, in the order they actually run. The
  // host sees every entry on the cards (so they can put one back), but a
  // guest-facing popup listing a ceremony that is switched off - or one of
  // their own still waiting for its name and photo - would be a straight lie.
  function ceremonies() {
    return (RY.config.ceremonies || [])
      .filter(RY.ceremonyLive)
      .map(function (c) {
        return {
          name: (c.name || '').trim(),
          date: c.date || '',
          time: c.time || '',
          dateLabel: RY.fmtDate(c.date),
          timeLabel: RY.fmtTime(c.time),
          venue: (c.venue || '').trim(),
          mapUrl: RY.mapLink(c),
        };
      })
      .sort(function (a, b) {
        return (a.date + a.time).localeCompare(b.date + b.time);
      });
  }

  function joinNames(arr) {
    if (arr.length <= 1) return arr[0] || '';
    return arr.slice(0, -1).join(', ') + ' & ' + arr[arr.length - 1];
  }

  // Ceremonies grouped by the day they fall on, chronological.
  function days() {
    var out = [];
    ceremonies().forEach(function (c) {
      if (!c.dateLabel) return;
      var d = out.filter(function (x) { return x.dateLabel === c.dateLabel; })[0];
      if (!d) { d = { date: c.date, dateLabel: c.dateLabel, list: [] }; out.push(d); }
      d.list.push(c);
    });
    return out;
  }

  // Ceremonies grouped by venue, in first-appearance order. The venue's name is
  // split off the rest of the address so the two can be set differently and the
  // name is not repeated on both lines.
  function locations() {
    var out = [];
    ceremonies().forEach(function (c) {
      if (!c.venue) return;
      var l = out.filter(function (x) { return x.address === c.venue; })[0];
      if (!l) {
        l = {
          names: [],
          venue: c.venue.split(',')[0].trim(),
          rest: c.venue.split(',').slice(1).join(',').trim(),
          address: c.venue,
          mapUrl: c.mapUrl,
        };
        out.push(l);
      }
      l.names.push(c.name);
    });
    out.forEach(function (l) { l.ceremonies = joinNames(l.names); });
    return out;
  }

  // ---- Calendar (.ics) ------------------------------------------------------
  function pad(n) { return String(n).padStart(2, '0'); }
  function icsEsc(s) { return String(s).replace(/([,;\\])/g, '\\$1'); }

  // The exclusive end-date an all-day range needs (Google/Outlook/ICS all
  // share this convention), as YYYYMMDD - one calendar day past day.date.
  // Shared by veventForDay and the two provider URL builders below, so the
  // "+1 day" arithmetic exists in exactly one place.
  function dayEndYmd(day) {
    var d = new Date(day.date + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  }

  // The title (every ceremony's name, joined) and one-line-per-ceremony
  // description a day's worth of ceremonies boils down to - shared, unescaped,
  // by the ICS vevent and both provider URL builders, each of which escapes or
  // encodes it its own way.
  function daySummary(day) {
    return {
      names: joinNames(day.list.map(function (c) { return c.name; })),
      desc: day.list.map(function (c) {
        return c.name +
          (c.timeLabel ? ' - ' + c.timeLabel : '') +
          (c.venue ? ' · ' + c.venue : '');
      }).join('\n'),
      venue: day.list[0].venue || '',
    };
  }

  // One all-day event per DAY rather than a timed event per ceremony: a guest
  // wants the date blocked out, not six overlapping entries, and an all-day
  // event carries no timezone to get wrong.
  function veventForDay(day) {
    var dt = day.date.replace(/-/g, '');
    var end = dayEndYmd(day);
    var s = daySummary(day);
    var stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return [
      'BEGIN:VEVENT', 'UID:ry-day-' + dt + '@invitation', 'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:' + dt, 'DTEND;VALUE=DATE:' + end,
      'SUMMARY:' + icsEsc(s.names), 'DESCRIPTION:' + icsEsc(s.desc).replace(/\n/g, '\\n'),
      'LOCATION:' + icsEsc(s.venue),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY',
      'DESCRIPTION:' + icsEsc(s.names), 'END:VALARM',
      'END:VEVENT',
    ];
  }

  function wrapIcs(events) {
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN'].concat(events, 'END:VCALENDAR').join('\r\n');
  }

  function downloadIcs(name, ics) {
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  // ---- Calendar (provider deep links) ---------------------------------------
  // Google and Outlook both take the event as a query string and open THEIR own
  // "add event" screen pre-filled - no file, no import step, and on Android or
  // in the Google app the link opens Google Calendar directly. Neither supports
  // more than one event per link, which is why these are only offered for a
  // single day (see the per-day picker below) and "Add all dates" stays
  // .ics-only: an ICS file is the one format here that can hold more than one
  // VEVENT.
  function googleCalendarUrl(day) {
    var s = daySummary(day);
    var params = new URLSearchParams({
      action: 'TEMPLATE',
      text: s.names,
      dates: day.date.replace(/-/g, '') + '/' + dayEndYmd(day),
      details: s.desc,
      location: s.venue,
    });
    return 'https://calendar.google.com/calendar/render?' + params.toString();
  }

  function outlookCalendarUrl(day) {
    var s = daySummary(day);
    var params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      allday: 'true',
      startdt: day.date,
      enddt: day.date,
      subject: s.names,
      body: s.desc,
      location: s.venue,
    });
    return 'https://outlook.live.com/calendar/0/deeplink/compose?' + params.toString();
  }

  // ---- Open / close ---------------------------------------------------------
  var lastFocus = null;

  function openModal(html) {
    content.innerHTML = html;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var focusable = modal.querySelector('a, button:not([data-ry-close]), [tabindex]');
    (focusable || modal.querySelector('[data-ry-close]')).focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-ry-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  var DIVIDER = '<span class="ry-modal__divider" aria-hidden="true"></span>';

  var PIN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
    '<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z"/>' +
    '<circle cx="12" cy="10" r="2.4"/></svg>';

  var CAL_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
    '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>';

  function emptyRow(text) {
    return '<p class="ry-modal__empty">' + esc(text) + '</p>';
  }

  // ---- Instagram ------------------------------------------------------------
  function instagramUrl() {
    return ((RY.config.social && RY.config.social.instagramUrl) || '').trim();
  }

  if (igBtn) {
    igBtn.addEventListener('click', function () {
      openModal(
        '<h3 class="ry-modal__title" id="ryModalTitle">Follow the Couple</h3>' + DIVIDER +
        '<p class="ry-modal__text">Would you like to open the couple’s Instagram page?</p>' +
        '<div class="ry-modal__actions">' +
        '<a class="ry-modal__btn ry-modal__btn--primary" href="' +
        esc(instagramUrl() || 'https://www.instagram.com/') +
        '" target="_blank" rel="noopener">Open Instagram</a>' +
        '<button class="ry-modal__btn" type="button" data-ry-close>Not now</button>' +
        '</div>'
      );
    });
  }

  // ---- Locations ------------------------------------------------------------
  if (locBtn) {
    locBtn.addEventListener('click', function () {
      var items = locations().map(function (l) {
        return '<a class="ry-loc" href="' + esc(l.mapUrl) + '" target="_blank" rel="noopener">' +
          '<span class="ry-loc__pin" aria-hidden="true">' + PIN_SVG + '</span>' +
          '<span class="ry-loc__text">' +
          '<span class="ry-loc__ceremonies">' + esc(l.ceremonies) + '</span>' +
          '<span class="ry-loc__venue">' + esc(l.venue) + '</span>' +
          (l.rest ? '<span class="ry-loc__addr">' + esc(l.rest) + '</span>' : '') +
          '</span>' +
          '<span class="ry-loc__go" aria-hidden="true">›</span>' +
          '</a>';
      }).join('');

      openModal(
        '<h3 class="ry-modal__title" id="ryModalTitle">Ceremony Locations</h3>' + DIVIDER +
        (items
          ? '<div class="ry-loc-list">' + items + '</div>'
          : emptyRow('No venues have been added yet.'))
      );
    });
  }

  // ---- Calendar -------------------------------------------------------------
  // Two screens in the one popup: the date list (openCalendarList), and - once
  // a guest picks a day - a "which calendar" step (openDayPicker) offering
  // Google's and Outlook's own pre-filled pages or a plain .ics for Apple
  // Calendar and everything else. "Add all dates" skips the picker and goes
  // straight to .ics, the one format of the three that can hold more than one
  // day - see the note on googleCalendarUrl/outlookCalendarUrl.
  function openCalendarList() {
    var items = days().map(function (day, i) {
      return '<button class="ry-loc" type="button" data-ry-cal-day="' + i + '">' +
        '<span class="ry-loc__pin" aria-hidden="true">' + CAL_SVG + '</span>' +
        '<span class="ry-loc__text">' +
        '<span class="ry-loc__ceremonies">' + esc(day.dateLabel) + '</span>' +
        '<span class="ry-loc__venue">' +
        esc(joinNames(day.list.map(function (c) { return c.name; }))) + '</span>' +
        '</span>' +
        '<span class="ry-loc__go" aria-hidden="true">+</span>' +
        '</button>';
    }).join('');

    openModal(
      '<h3 class="ry-modal__title" id="ryModalTitle">Add to Calendar</h3>' + DIVIDER +
      (items
        ? '<div class="ry-loc-list">' + items + '</div>' +
        '<div class="ry-modal__actions">' +
        '<button class="ry-modal__btn ry-modal__btn--primary" type="button" data-ry-cal-all>' +
        'Add all dates</button></div>'
        : emptyRow('No dated ceremonies to add yet.'))
    );
  }

  function openDayPicker(i) {
    var day = days()[i];
    if (!day) return;

    openModal(
      '<h3 class="ry-modal__title" id="ryModalTitle">' + esc(day.dateLabel) + '</h3>' + DIVIDER +
      '<p class="ry-modal__text">Which calendar would you like to add this to?</p>' +
      '<div class="ry-modal__actions">' +
      '<a class="ry-modal__btn ry-modal__btn--primary" href="' + esc(googleCalendarUrl(day)) +
      '" target="_blank" rel="noopener">Google Calendar</a>' +
      '<a class="ry-modal__btn" href="' + esc(outlookCalendarUrl(day)) +
      '" target="_blank" rel="noopener">Outlook</a>' +
      '<button class="ry-modal__btn" type="button" data-ry-cal-ics="' + i + '">Apple Calendar &amp; others</button>' +
      '</div>' +
      '<p class="ry-modal__text"><button class="ry-modal__link" type="button" data-ry-cal-back>' +
      '&larr; Back to dates</button></p>'
    );
  }

  if (calBtn) {
    calBtn.addEventListener('click', openCalendarList);
  }

  // Delegated, because the rows are written into the popup after it opens.
  // Recomputed on click rather than captured when the popup was built: in edit
  // mode the host may have changed a date in between.
  content.addEventListener('click', function (e) {
    if (e.target.closest('[data-ry-cal-all]')) {
      var all = days().reduce(function (acc, d) { return acc.concat(veventForDay(d)); }, []);
      if (all.length) downloadIcs('all-ceremonies.ics', wrapIcs(all));
      return;
    }
    if (e.target.closest('[data-ry-cal-back]')) {
      openCalendarList();
      return;
    }
    var icsBtn = e.target.closest('[data-ry-cal-ics]');
    if (icsBtn) {
      var icsDay = days()[+icsBtn.dataset.ryCalIcs];
      if (icsDay) downloadIcs('ceremonies-' + icsDay.date + '.ics', wrapIcs(veventForDay(icsDay)));
      return;
    }
    var row = e.target.closest('[data-ry-cal-day]');
    if (row) {
      openDayPicker(+row.dataset.ryCalDay);
    }
  });
})();
