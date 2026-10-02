import React, { useState, useEffect } from 'react';

export default function OrientationWrapper({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const mobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;
      const portrait = window.innerHeight > window.innerWidth;

      setIsMobile(mobileDevice);
      setIsPortrait(portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // If on mobile and in portrait mode, prompt to rotate phone to landscape
  if (isMobile && isPortrait) {
    return (
      <div className="orientation-prompt-overlay">
        <div className="orientation-prompt-card">
          <div className="orientation-icon-container">
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
          </div>
          <h2 className="orientation-title">Rotate Your Device</h2>
          <p className="orientation-subtitle">
            Please turn your phone sideways to landscape mode to unlock the experience.
          </p>
        </div>
      </div>
    );
  }

  // Once in landscape mode (or on desktop), render children directly so surprise popup shows immediately
  return children;
}
