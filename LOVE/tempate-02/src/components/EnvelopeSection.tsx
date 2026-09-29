import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Heart, Sparkles } from 'lucide-react';

interface EnvelopeSectionProps {
  onOpenEnvelope: () => void;
}

export const EnvelopeSection: React.FC<EnvelopeSectionProps> = ({ onOpenEnvelope }) => {
  const [isOpened, setIsOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const sealLeftRef = useRef<HTMLDivElement>(null);
  const sealRightRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);

  const handleEnvelopeClick = () => {
    if (isOpened) return;
    setIsOpened(true);

    const tl = gsap.timeline({
      onComplete: () => {
        // Trigger polaroid rain sequence immediately as letter reaches top
        onOpenEnvelope();
      }
    });

    // 1. Crack wax seal & spark explosion
    tl.to(sealRef.current, {
      scale: 1.15,
      duration: 0.15,
      ease: "power1.out"
    })
    .to(sealLeftRef.current, {
      x: -25,
      y: -10,
      rotation: -35,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(2)"
    }, "+=0.05")
    .to(sealRightRef.current, {
      x: 25,
      y: 10,
      rotation: 35,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(2)"
    }, "<")
    .to(sparkRef.current, {
      opacity: 1,
      scale: 1.8,
      duration: 0.3,
      ease: "power2.out"
    }, "<")
    .to(sparkRef.current, {
      opacity: 0,
      duration: 0.2
    })
    // 2. Fade out whole envelope after seal breaks
    .to(containerRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: "power2.in"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-transparent px-4 overflow-hidden select-none cursor-pointer"
      onClick={handleEnvelopeClick}
      ref={containerRef}
    >

      {/* Floating Sparkles & Text Hint */}
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8 text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-love-200/80 shadow-sm text-love-800 text-xs tracking-widest uppercase font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
          <span>Tap envelope to open</span>
          <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
        </div>
      </motion.div>

      {/* Realistic 3D Envelope Container */}
      <div className="relative w-[320px] sm:w-[380px] h-[240px] sm:h-[270px] envelope-container">
        
        {/* Breathing Animation Wrapper */}
        <motion.div 
          animate={isOpened ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full"
        >

          {/* Envelope Back Base */}
          <div className="absolute inset-0 bg-[#F5ECE0] rounded-lg shadow-2xl border border-cream-300 envelope-part" />

          {/* Sliding Letter (Hidden inside initially) */}
          <div 
            ref={letterRef}
            className="absolute inset-x-4 top-3 bottom-3 bg-[#FFFDF9] rounded-md shadow-md border border-cream-200 p-6 flex flex-col justify-between z-10 transition-all duration-300 pointer-events-none paper-texture"
          >
            <div className="border-b border-love-100/80 pb-3 flex items-center justify-between">
              <span className="font-serif italic text-love-900 text-sm font-semibold">My Heart For You</span>
              <Heart className="w-4 h-4 text-love-500 fill-love-400" />
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-love-100/60 rounded-full w-3/4" />
              <div className="h-2 bg-love-100/40 rounded-full w-full" />
              <div className="h-2 bg-love-100/50 rounded-full w-5/6" />
            </div>
            <div className="text-right">
              <span className="font-handwriting text-love-800 text-xl">Forever & Always</span>
            </div>
          </div>

          {/* Envelope Pocket Flaps (Left, Right, Bottom overlay) */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg envelope-part">
            {/* Left Triangle */}
            <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#F3E8DA] [clip-path:polygon(0_0,_100%_50%,_0_100%)] border-r border-cream-300/40 shadow-inner" />
            {/* Right Triangle */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#EAD8C3] [clip-path:polygon(100%_0,_0_50%,_100%_100%)] border-l border-cream-300/40 shadow-inner" />
            {/* Bottom Triangle */}
            <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-[#FAF5EE] [clip-path:polygon(0_100%,_50%_0,_100%_100%)] border-t border-cream-300/50 shadow-md" />
          </div>

          {/* Receiver Text on Bottom Flap */}
          <div className="absolute bottom-6 left-0 right-0 z-30 text-center pointer-events-none px-4 envelope-part">
            <p className="font-serif text-xs tracking-widest text-love-800/70 uppercase font-semibold">To,</p>
            <h2 className="font-serif italic text-2xl sm:text-3xl text-burgundy font-bold tracking-wide mt-0.5 drop-shadow-sm">
              My Favourite Person ❤️
            </h2>
          </div>

          {/* Envelope Top Flap (Rotates 180° open on X axis) */}
          <div 
            ref={flapRef}
            className="absolute top-0 left-0 right-0 h-[55%] bg-[#FDF6E2] [clip-path:polygon(0_0,_50%_100%,_100%_0)] origin-top z-30 border-b border-gold-300/40 shadow-md envelope-part"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Flap Texture & Gradient */}
            <div className="w-full h-full bg-gradient-to-b from-cream-100 to-cream-200" />
          </div>

          {/* Wax Seal (Cracks on click) */}
          <div 
            ref={sealRef}
            className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer group envelope-part"
          >
            {/* Golden Spark Particle Burst Container */}
            <div ref={sparkRef} className="absolute inset-[-20px] opacity-0 pointer-events-none flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gold-400/40 blur-md" />
            </div>

            {/* Split Wax Seal Left & Right */}
            <div className="relative w-16 h-16 rounded-full shadow-gold-glow flex items-center justify-center">
              {/* Seal Left Half */}
              <div 
                ref={sealLeftRef}
                className="absolute inset-0 bg-gradient-to-br from-burgundy-light via-burgundy to-burgundy-dark rounded-full flex items-center justify-center border-2 border-gold-400 overflow-hidden shadow-lg"
                style={{ clipPath: 'polygon(0 0, 52% 0, 52% 100%, 0 100%)' }}
              >
                <div className="w-12 h-12 rounded-full border border-gold-300/50 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gold-400 fill-gold-500" />
                </div>
              </div>

              {/* Seal Right Half */}
              <div 
                ref={sealRightRef}
                className="absolute inset-0 bg-gradient-to-br from-burgundy-light via-burgundy to-burgundy-dark rounded-full flex items-center justify-center border-2 border-gold-400 overflow-hidden shadow-lg"
                style={{ clipPath: 'polygon(48% 0, 100% 0, 100% 100%, 48% 100%)' }}
              >
                <div className="w-12 h-12 rounded-full border border-gold-300/50 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gold-400 fill-gold-500" />
                </div>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </motion.div>
  );
};
