/* ============================================
   TEMPLATE 07 — SKETCHBOOK & DOODLE BIRTHDAY SCRIPT
   ============================================ */

(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  /* ── Current Date Formatter ── */
  function setDate() {
    const el = $('#currentDate');
    if (!el) return;
    const d = new Date();
    const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    el.textContent = `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  /* ── Custom SVG Drawing Loader ── */
  function runLoader() {
    const loader = $('.loader');
    const bar = $('.sketch-progress-fill');
    const status = $('.sketch-label');
    
    if (!loader || !bar) return;

    let progress = 0;
    const steps = [
      'Sharpening pencils...',
      'Opening birthday sketchbook...',
      'Doodling margins...',
      'Taping pictures down...',
      'Ready to flip!'
    ];

    const tick = setInterval(() => {
      progress += Math.random() * 15 + 5;
      
      const textIdx = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);
      if (status) status.textContent = steps[textIdx];

      if (progress >= 100) {
        progress = 100;
        clearInterval(tick);
        bar.style.width = '100%';
        
        setTimeout(() => {
          loader.classList.add('loaded');
          boot();
        }, 500);
      }
      bar.style.width = progress + '%';
    }, 120);
  }

  /* ── Boot ── */
  function boot() {
    setDate();
    initScrollProgress();
    initReveals();
    initDoodleDrawing();
    initThemeToggle();
    initMusicToggle();
    initShareModal();
    initSmoothCTA();
    fireSketchyConfetti();
  }

  /* ── Scroll Progress ── */
  function initScrollProgress() {
    const bar = $('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Intersection Observer Reveals ── */
  function initReveals() {
    const els = $$('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ── Doodle Line Drawing Animations ── */
  function initDoodleDrawing() {
    const paths = $$('.sketch-underline path, .doodle path, .doodle circle');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.2, 0.8, 0.2, 1)';
      
      // trigger drawing after delay
      setTimeout(() => {
        path.style.strokeDashoffset = '0';
      }, 300);
    });
  }

  /* ── Notebook Shade Toggle ── */
  function initThemeToggle() {
    const btn = $('#themeToggle');
    if (!btn) return;
    let dark = false;
    btn.addEventListener('click', () => {
      dark = !dark;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      btn.classList.toggle('active', dark);
    });
  }

  /* ── Music soundwave wave simulate ── */
  function initMusicToggle() {
    const btn = $('#musicToggle');
    const audio = $('#bgMusic');
    if (!btn || !audio) return;
    
    let playing = false;
    btn.addEventListener('click', () => {
      playing = !playing;
      if (playing) {
        audio.play().catch(() => { playing = false; });
        btn.classList.add('active');
      } else {
        audio.pause();
        btn.classList.remove('active');
      }
    });
  }

  /* ── Smooth CTA Scroll ── */
  function initSmoothCTA() {
    const btn = $('#ctaBtn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = $('#photoSection');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ── Share Modal ── */
  function initShareModal() {
    const modal = $('#shareModal');
    const open1 = $('#shareToggle');
    const open2 = $('#footerShareBtn');
    const close = modal ? modal.querySelector('.share-close') : null;
    const bg    = modal ? modal.querySelector('.share-modal-bg') : null;
    const url   = $('#shareUrl');
    const copy  = $('#shareCopy');

    if (!modal) return;
    if (url) url.value = window.location.href;

    const show = () => modal.classList.add('active');
    const hide = () => modal.classList.remove('active');

    if (open1) open1.addEventListener('click', show);
    if (open2) open2.addEventListener('click', show);
    if (close) close.addEventListener('click', hide);
    if (bg)    bg.addEventListener('click', hide);

    if (copy && url) {
      copy.addEventListener('click', () => {
        url.select();
        document.execCommand('copy');
        copy.textContent = 'COPIED';
        setTimeout(() => { copy.textContent = 'COPY'; }, 2000);
      });
    }
  }

  /* ── Hand-Drawn Sketchy Confetti (Stars, Circles, Scribbles) ── */
  function fireSketchyConfetti() {
    const c = document.createElement('canvas');
    c.className = 'confetti-canvas';
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    // strictly B&W pencil tones
    const cols = ['#1A1A1A', '#888888', '#CCCCCC', '#A32A2A', '#DCD7C8'];
    const shapes = ['star', 'circle', 'line', 'scribble'];
    const particles = [];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height - c.height,
        size: Math.random() * 8 + 4,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: cols[Math.floor(Math.random() * cols.length)],
        speed: Math.random() * 2.5 + 1.2,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05,
        drift: (Math.random() - 0.5) * 0.8,
        opacity: 1
      });
    }

    let frame = 0;
    const max = 200;

    (function loop() {
      ctx.clearRect(0, 0, c.width, c.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.lineWidth = 1.5;

        // Custom hand-drawn paths for each shape
        if (p.shape === 'star') {
          ctx.beginPath();
          for (let k = 0; k < 5; k++) {
            ctx.lineTo(Math.cos((18 + k * 72) * Math.PI / 180) * p.size,
                       Math.sin((18 + k * 72) * Math.PI / 180) * p.size);
            ctx.lineTo(Math.cos((54 + k * 72) * Math.PI / 180) * (p.size/2),
                       Math.sin((54 + k * 72) * Math.PI / 180) * (p.size/2));
          }
          ctx.closePath();
          ctx.stroke();
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.shape === 'line') {
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.lineTo(p.size / 2, 0);
          ctx.stroke();
        } else if (p.shape === 'scribble') {
          ctx.beginPath();
          ctx.moveTo(-p.size/2, -p.size/2);
          ctx.quadraticCurveTo(0, p.size/2, p.size/2, -p.size/2);
          ctx.stroke();
        }
        
        ctx.restore();
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (frame > max - 60) p.opacity -= 0.016;
      });
      frame++;
      if (frame < max) requestAnimationFrame(loop);
      else c.remove();
    })();
  }

  document.addEventListener('DOMContentLoaded', runLoader);

})();
