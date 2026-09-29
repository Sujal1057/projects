import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { MEMORIES } from '../data/memories';

interface PolaroidRainProps {
  onComplete: () => void;
}

export const PolaroidRain: React.FC<PolaroidRainProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-calculate randomized rain parameters for 15 polaroids
  const rainConfig = useMemo(() => {
    return MEMORIES.slice(0, 15).map((memory, idx) => {
      // Scatter positions across screen width (5% to 82%)
      const leftPercent = 5 + (Math.random() * 77);
      // Truly random delay so they don't drop sequentially in a line
      const delay = Math.random() * 2.5; 
      // Randomized speed (2.5s to 4.2s)
      const duration = 2.5 + (Math.random() * 1.7);
      // Random rotations
      const startRotation = (Math.random() * 50) - 25;
      const endRotation = startRotation + ((Math.random() * 30) - 15);
      // Gentle horizontal drift as they fall
      const driftX = (Math.random() - 0.5) * 100;

      return {
        memory,
        leftPercent,
        delay,
        duration,
        startRotation,
        endRotation,
        driftX,
        zIndex: 10 + idx
      };
    });
  }, []);

  useEffect(() => {
    const polaroidElems = containerRef.current?.querySelectorAll('.polaroid-item');
    if (!polaroidElems || polaroidElems.length === 0) return;

    const screenHeight = window.innerHeight;
    const timeline = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    polaroidElems.forEach((elem, index) => {
      const config = rainConfig[index];
      const targetY = screenHeight + 450;

      // Initial off-screen state top
      gsap.set(elem, {
        y: -400,
        x: 0,
        rotation: config.startRotation,
        opacity: 1
      });

      // Scatter drop animation with horizontal sway
      timeline.to(elem, {
        y: targetY,
        x: config.driftX,
        rotation: config.endRotation,
        duration: config.duration,
        ease: "power1.in",
      }, config.delay);
    });

    return () => {
      timeline.kill();
    };
  }, [rainConfig, onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden bg-transparent flex items-start justify-center"
    >
      {/* 15 Polaroid Frames Scattered Across Screen */}
      <div className="relative w-full h-full max-w-6xl mx-auto px-4">
        {rainConfig.map((item) => (
          <div
            key={item.memory.id}
            className="polaroid-item absolute w-[130px] sm:w-[160px] bg-white p-2.5 sm:p-3 rounded-sm shadow-paper border border-cream-200 pointer-events-auto transition-shadow hover:shadow-2xl"
            style={{
              left: `${item.leftPercent}%`,
              zIndex: item.zIndex,
            }}
          >
            {/* Photo Frame Container */}
            <div className="relative aspect-[4/3] bg-love-50 overflow-hidden rounded-xs border border-love-100/60">
              <img
                src={item.memory.imageUrl}
                alt={item.memory.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Caption Underneath */}
            <div className="pt-2 text-center">
              <p className="font-handwriting text-love-900 text-xs sm:text-sm tracking-wide leading-tight truncate font-bold">
                {item.memory.caption}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-love-400 font-sans font-semibold mt-0.5">
                {item.memory.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
