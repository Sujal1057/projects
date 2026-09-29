import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { StoryState } from './types';
import { AudioPlayer } from './components/AudioPlayer';
import { HeartBackground } from './components/HeartBackground';
import { BackgroundParticles } from './components/BackgroundParticles';
import { ClickSparkles } from './components/ClickSparkles';
import { FloatingFlowers } from './components/FloatingFlowers';
import { IntroSection } from './components/IntroSection';
import { EnvelopeSection } from './components/EnvelopeSection';
import { PolaroidRain } from './components/PolaroidRain';
import { LoveLetterSection } from './components/LoveLetterSection';
import { SpotifySection } from './components/SpotifySection';
import { ReasonsSection } from './components/ReasonsSection';
import { LoveCountdown } from './components/LoveCountdown';
import { MemoryBooth } from './components/MemoryBooth';
import { FinalSection } from './components/FinalSection';
import { DeviceOrientationPrompt } from './components/DeviceOrientationPrompt';

export const App: React.FC = () => {
  const [storyState, setStoryState] = useState<StoryState>('intro');
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Check device orientation
  useEffect(() => {
    // Detect if device is a mobile or tablet once
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768 && window.innerHeight > window.innerWidth);
    setIsMobile(isMobileDevice);
    
    if (!isMobileDevice) {
      setHasStarted(true);
    }

    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Initialize Lenis Smooth Scroll when scrolling unlocked
  useEffect(() => {
    if (storyState !== 'scrolling') return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, [storyState]);

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStoryState('intro');
  };

  return (
    <div className="relative min-h-screen w-full text-[#5C1425] overflow-x-hidden selection:bg-love-200 selection:text-love-900">
      
      {/* Permanent Fixed Heart-Shaped Center Gradient Background */}
      <HeartBackground />

      {/* Interactive Floating Heart & Gold Sparkle Trail on Click/Tap */}
      <ClickSparkles />

      {/* Background Floating Bokeh Particles */}
      <BackgroundParticles />

      {/* Floating Audio Player */}
      <AudioPlayer />

      {/* Story State Renderer */}
      <AnimatePresence mode="wait">
        {isMobile && (!hasStarted || isPortrait) ? (
          <DeviceOrientationPrompt 
            key="orientation-prompt" 
            isPortrait={isPortrait} 
            onStart={() => setHasStarted(true)} 
          />
        ) : (
          <>
            {storyState === 'intro' && (
              <IntroSection key="intro" onComplete={() => setStoryState('envelope')} />
            )}

        {storyState === 'envelope' && (
          <EnvelopeSection key="envelope" onOpenEnvelope={() => setStoryState('rain')} />
        )}

        {storyState === 'rain' && (
          <PolaroidRain key="rain" onComplete={() => setStoryState('letter')} />
        )}
          </>
        )}
      </AnimatePresence>

      {/* Unlocked Main Story Flow */}
      {hasStarted && !isPortrait && (storyState === 'letter' || storyState === 'scrolling') && (
        <main className="relative z-10">
          {/* Decorative Floating Flower Accents */}
          <FloatingFlowers />

          <LoveLetterSection onComplete={() => setStoryState('scrolling')} />

          {storyState === 'scrolling' && (
            <>
              <SpotifySection />
              <ReasonsSection />
              <LoveCountdown />
              <MemoryBooth />
              <FinalSection onReplay={handleReplay} />
            </>
          )}
        </main>
      )}

    </div>
  );
};

export default App;
