import React, { useState, useEffect } from 'react';

export default function ScaledSection({
  children,
  className = '',
  baseWidth = 1280,
  baseHeight = 800,
  style = {},
  overflow = 'hidden'
}) {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const mobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || w <= 768;

      setIsMobile(mobileDevice);

      if (mobileDevice && w < baseWidth) {
        setScale(w / baseWidth);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseWidth]);

  // Laptop/Desktop View: Keep original 100% width/height layout
  if (!isMobile) {
    return (
      <div className={className} style={{ width: '100%', minHeight: '100vh', ...style }}>
        {children}
      </div>
    );
  }

  // Mobile View: Proportional scaling canvas
  const scaledHeight = Math.round(baseHeight * scale);

  return (
    <div
      style={{
        width: '100vw',
        maxWidth: '100vw',
        height: `${scaledHeight}px`,
        position: 'relative',
        overflow: overflow,
        ...style
      }}
    >
      <div
        className={className}
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
