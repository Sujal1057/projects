import React, { useState, useEffect } from 'react';

export default function OrientationWrapper({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const mobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;
      const portrait = window.innerHeight > window.innerWidth;

      setIsMobile(mobileDevice);
      setIsPortrait(portrait);

      if (!mobileDevice) {
        setHasStarted(true);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      if (!isFS && isMobile) {
        setHasStarted(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isMobile]);

  const handleEnterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setHasStarted(true);
  };

  if (isMobile && (!hasStarted || isPortrait)) {
    return (
      <div className="orientation-prompt-overlay">
        <div className="orientation-prompt-card">
          <div className="orientation-icon-container">
            {isPortrait ? (
              <svg
                className="phone-icon-portrait"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            ) : (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </div>
          <h2 className="orientation-title">
            {isPortrait ? 'Rotate Your Device' : 'Ready For Magic?'}
          </h2>
          <p className="orientation-subtitle">
            {isPortrait
              ? 'Please turn your phone sideways to landscape mode to unlock the experience.'
              : 'You are in landscape mode! Click below to enter full screen.'}
          </p>
          <button
            disabled={isPortrait}
            onClick={handleEnterFullscreen}
            className={`orientation-btn ${isPortrait ? 'disabled' : 'active'}`}
          >
            {isPortrait ? 'Waiting for rotation...' : 'Enter Fullscreen ⛶'}
          </button>
        </div>
      </div>
    );
  }

  return children;
}
