import React, { useCallback, useEffect, useState, useRef } from 'react';
import './mobileGate.css';
import bgMusic from '../../assets/until_i_found_you.mp3';

/**
 * MobileGate — phone-only wrapper (desktop/tablet render children untouched).
 *
 * 1. Portrait phone  -> "Rotate your phone" screen.
 * 2. Landscape phone -> page is rendered on a fixed-height "stage" and scaled
 *    to fit, so every element keeps EXACTLY the same position/proportions as
 *    on desktop (no layout compromise).
 * 3. Landscape + not fullscreen -> "tap to enter full screen" screen (a tap
 *    is required by browsers). Exiting fullscreen shows it again.
 * 4. Rotating back to portrait shows the rotate screen again.
 */

// Virtual desktop height the page is designed/rendered at on phones
const DESIGN_HEIGHT = 800;

const detectPhone = () => {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const shortSide = Math.min(window.screen.width, window.screen.height);
  return coarse && shortSide < 600;
};

const getFullscreenElement = () =>
  document.fullscreenElement || document.webkitFullscreenElement || null;

const fullscreenSupported = () => {
  const el = document.documentElement;
  return !!(el.requestFullscreen || el.webkitRequestFullscreen);
};

const requestFullscreen = async () => {
  const el = document.documentElement;
  try {
    if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  } catch (err) {
    console.warn('Fullscreen request failed:', err);
  }
};

const readViewport = () => ({
  w: window.innerWidth,
  h: window.innerHeight
});

export default function MobileGate({ children }) {
  const [isPhone, setIsPhone] = useState(detectPhone);
  const [vp, setVp] = useState(readViewport);
  const [isFullscreen, setIsFullscreen] = useState(() => !!getFullscreenElement());
  const [canFullscreen] = useState(fullscreenSupported);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize the background music
    audioRef.current = new Audio(bgMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Set volume to 50%
  }, []);

  useEffect(() => {
    const onResize = () => {
      setVp(readViewport());
      setIsPhone(detectPhone());
    };
    const onFsChange = () => {
      setIsFullscreen(!!getFullscreenElement());
      // Re-measure after the browser finishes resizing to fullscreen
      setTimeout(onResize, 120);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  const goFullscreen = useCallback(() => {
    requestFullscreen();
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
    }
  }, []);

  // Desktop / tablet: no changes at all
  if (!isPhone) return children;

  const isPortrait = vp.h > vp.w;
  const scale = vp.h / DESIGN_HEIGHT;
  const stageWidth = vp.w / scale;

  const showFsPrompt = !isPortrait && canFullscreen && !isFullscreen;

  return (
    <div className="mg-viewport">
      {/* Scaled stage — keeps the desktop composition pixel-proportional */}
      <div
        className="mg-stage"
        style={{
          width: `${stageWidth}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `scale(${scale})`
        }}
        aria-hidden={isPortrait || showFsPrompt}
      >
        {children}
      </div>

      {/* 1. Rotate prompt (portrait) */}
      {isPortrait && (
        <div className="mg-overlay" role="dialog" aria-label="Rotate your phone">
          <svg className="mg-phone" viewBox="0 0 40 64" width="34" height="54" aria-hidden="true">
            <rect x="2" y="2" width="36" height="60" rx="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <line x1="16" y1="8" x2="24" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <h2 className="mg-title">please turn your phone</h2>
          <span className="mg-rule" aria-hidden="true" />
          <p className="mg-sub">best viewed in landscape</p>
        </div>
      )}

      {/* 2. Fullscreen prompt (landscape) — tap anywhere */}
      {showFsPrompt && (
        <button
          id="mg-fullscreen-btn"
          type="button"
          className="mg-overlay mg-overlay--tap"
          onClick={goFullscreen}
          aria-label="Enter full screen"
        >
          <span className="mg-title">a little surprise awaits</span>
          <span className="mg-rule" aria-hidden="true" />
          <span className="mg-sub">tap anywhere to open in full screen</span>
        </button>
      )}
    </div>
  );
}
