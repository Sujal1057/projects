// Royale - the invitation's config: single source of truth for the wedding details.
(function () {
  const params = new URLSearchParams(location.search);

  // ---- Opening invocation symbol ----------------------------------------
  const SYMBOLS = [
    { id: 'ganesha', label: 'Ganesha', src: 'media/_ganesha.svg' },
    { id: 'none', label: 'None', src: '' },
  ];

  const INVOCATIONS = {
    hindu: {
      label: 'Hindu',
      english: 'Shri Ganeshaya Namah',
      scripts: {
        devanagari: { label: 'Devanagari', text: 'श्री गणेशाय नमः', font: 'Tiro Devanagari Sanskrit' },
      },
    },
  };

  function symbolById(id) {
    for (let i = 0; i < SYMBOLS.length; i++) if (SYMBOLS[i].id === id) return SYMBOLS[i];
    return SYMBOLS[0];
  }

  function invocationLines(inv) {
    const sel = inv && inv.script;
    if (sel === 'custom') {
      return {
        religion: (inv && inv.religion) || 'hindu', script: 'custom',
        text: (inv && inv.custom) || '', font: '', rtl: false, isEnglish: false, isCustom: true,
      };
    }
    if (sel === 'blank') {
      return {
        religion: (inv && inv.religion) || 'hindu', script: 'blank',
        text: '', font: '', rtl: false, isEnglish: false, isBlank: true,
      };
    }
    const rel = INVOCATIONS.hindu;
    if (sel === 'english') {
      return { religion: 'hindu', script: 'english', text: rel.english || '', font: '', rtl: false, isEnglish: true };
    }
    const scr = rel.scripts.devanagari;
    return { religion: 'hindu', script: 'devanagari', text: scr.text, font: scr.font, rtl: false, isEnglish: false };
  }

  function addDaysISO(iso, days) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso;
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    d.setUTCDate(d.getUTCDate() + days);
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
  }

  const VIVAAH_ISO = '2026-12-20';

  const GALLERY_STARTERS = [
    { type: 'portrait', image: '', placeholder: true, caption: '#WhereItAllBegan', hang: 118 },
    { type: 'landscape', image: '', placeholder: true, caption: '#CherishedMoments', hang: 150 },
    { type: 'story', text: 'Two souls, brought together by destiny. What started with a simple conversation has blossomed into an eternal promise of love.', hang: 86 },
    { type: 'portrait', image: '', placeholder: true, caption: '#LittleThings', hang: 132 },
    { type: 'landscape', image: '', placeholder: true, caption: '#JoyAndLaughter', hang: 100 },
    { type: 'story', text: 'Together, we found a friendship that turned into our forever home. Hand in hand, we step into a lifetime of endless tomorrows.', hang: 120 },
    { type: 'portrait', image: '', placeholder: true, caption: '#ForeverBegins', hang: 150 },
    { type: 'landscape', image: '', placeholder: true, caption: '#AnanyaWedsAarav', hang: 92 },
  ];

  const DEFAULTS = {
    version: 1,
    finalized: true,

    invocation: { symbol: 'ganesha', religion: 'hindu', script: 'devanagari', custom: '' },

    brideName: 'Ananya',
    groomName: 'Aarav',
    title: 'Ananya & Aarav',
    hostNames: ['Ananya', 'Aarav'],

    introNote: 'we cordially invite you to grace the auspicious occasion of the marriage of…',

    eventISO: VIVAAH_ISO,
    revealButton: 'Reveal the Date',
    revealAfter: 'Save the Date',

    groomFamily: {
      enabled: true,
      name: 'Chi. Aarav Rathore',
      relLabel: 'Son of',
      parentA: 'Shri Vikram Singh Rathore',
      parentB: 'Smt. Sunita Rathore',
      parentJoin: '&',
      grandLabel: 'Grandson of',
      grandA: 'Late Shri Mahendra Singh Rathore',
      grandB: 'Late Smt. Kamla Devi Rathore',
      grandJoin: '&',
    },
    brideFamily: {
      enabled: true,
      name: 'Kum. Ananya Singhania',
      relLabel: 'Daughter of',
      parentA: 'Shri Rajesh Kumar Singhania',
      parentB: 'Smt. Meera Singhania',
      parentJoin: '&',
      grandLabel: 'Granddaughter of',
      grandA: 'Late Shri Hari Prasad Singhania',
      grandB: 'Late Smt. Shanti Devi Singhania',
      grandJoin: '&',
    },

    gallery: {
      enabled: true,
      items: GALLERY_STARTERS.slice(),
    },

    ceremonies: [
      { name: 'Ring Ceremony', art: 'media/ring_ceremony.webp', date: addDaysISO(VIVAAH_ISO, -2), time: '18:30', venue: 'The Grand Ballroom, Rambagh Palace, Jaipur', mapUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur', enabled: true },
      { name: 'Mehendi', art: 'media/mehendi.webp', date: addDaysISO(VIVAAH_ISO, -1), time: '11:00', venue: 'Mughal Garden, Rambagh Palace, Jaipur', mapUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur', enabled: true },
      { name: 'Haldi', art: 'media/haldi.webp', date: addDaysISO(VIVAAH_ISO, -1), time: '15:30', venue: 'Poolside Lawns, Rambagh Palace, Jaipur', mapUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur', enabled: true },
      { name: 'Sangeet', art: 'media/sangeet.webp', date: addDaysISO(VIVAAH_ISO, -1), time: '19:30', venue: 'Kesar Bagh, Rambagh Palace, Jaipur', mapUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur', enabled: true },
      { name: 'Vivaah', art: 'media/vivaah.webp', date: VIVAAH_ISO, time: '19:00', venue: 'Naksha Courtyard, Rambagh Palace, Jaipur', mapUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur', enabled: true },
      { name: 'Reception', art: 'media/reception.webp', date: addDaysISO(VIVAAH_ISO, 1), time: '20:00', venue: 'The Palace Gardens, Rambagh Palace, Jaipur', mapUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur', enabled: true },
    ],

    compliments: {
      enabled: true,
      lead: 'With Best Compliments From:',
      lines: [
        'Shri Suresh Rathore & Family (Chacha-Chachi)',
        'Shri Manoj Rathore & Family (Tau-Tai)',
        'Smt. Asha Shekhawat & Family (Bua)',
        'Shri Rajendra Rawal & Family (Mama-Mami)',
      ],
    },

    note: {
      enabled: true,
      lead: 'A Note From Us',
      text: 'We can’t wait to celebrate this special day with you. Thank you for being part of our journey.',
    },

    farewell: { line: 'Your Presence Means the World to Us' },

    social: { instagram: true, instagramUrl: '' },

    music: { enabled: true, src: '', volume: 0.5 },
  };

  function load() {
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function syncDerived() {
    const cfg = window.Royale.config;
    const bride = (cfg.brideName || '').trim();
    const groom = (cfg.groomName || '').trim();
    cfg.title = [bride, groom].filter(Boolean).join(' & ');
    cfg.hostNames = [bride, groom].filter(Boolean);
  }

  function save() { return true; }
  function reset() {}

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ));

  const nl2br = (s) => esc(s).replace(/\n/g, '<br />');

  function guestName() {
    return (params.get('to') || '').trim().slice(0, 80);
  }

  function fmtDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  function fmtTime(hhmm) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ''));
    if (!m) return '';
    return new Date(2000, 0, 1, +m[1], +m[2])
      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function mapLink(c) {
    const own = ((c && c.mapUrl) || '').trim();
    if (own) return own;
    const venue = ((c && c.venue) || '').trim();
    return venue ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue) : '';
  }

  function ceremonyLive(c) {
    if (!c || c.enabled === false) return false;
    return !!((c.art || '').trim() && (c.name || '').trim());
  }

  function ceremoniesByDate(list) {
    const when = (c) => (/^\d{4}-\d{2}-\d{2}$/.test(c.date || '') ? c.date : '9999-99-99') + ' ' + (c.time || '');
    return (Array.isArray(list) ? list : []).slice().sort((a, b) => when(a).localeCompare(when(b)));
  }

  window.Royale = {
    mode: 'view',
    canEdit: function () { return false; },
    config: load(),
    DEFAULTS,
    SYMBOLS,
    INVOCATIONS,
    symbolById,
    invocationLines,
    addDaysISO,
    save,
    reset,
    syncDerived,
    esc,
    nl2br,
    guestName,
    fmtDate,
    fmtTime,
    mapLink,
    ceremonyLive,
    ceremoniesByDate,
  };
})();
