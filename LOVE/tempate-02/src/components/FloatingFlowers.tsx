import React from 'react';
import { motion } from 'framer-motion';

import flower1 from '../../assets/flower1.png';
import flower2 from '../../assets/flower2.png';
import flower3 from '../../assets/flower3.png';
import flower4 from '../../assets/flower4.png';
import flower5 from '../../assets/flower5.png';

interface FlowerItem {
  id: number;
  src: string;
  topPercent: number; // 0 to 100
  left: string; // e.g. "4%", "88%"
  width: string; // e.g. "w-28 sm:w-44"
  duration: number;
  rotateRange: [number, number, number];
  delay: number;
  opacity: number;
}

const FLOWERS_CONFIG: FlowerItem[] = [
  // Love Letter Section
  { id: 1, src: flower1, topPercent: 3, left: '86%', width: 'w-28 sm:w-44', duration: 6, rotateRange: [0, 6, 0], delay: 0, opacity: 0.85 },
  { id: 2, src: flower2, topPercent: 6, left: '-2%', width: 'w-32 sm:w-48', duration: 7, rotateRange: [0, -5, 0], delay: 0.3, opacity: 0.85 },
  { id: 3, src: flower5, topPercent: 12, left: '88%', width: 'w-24 sm:w-40', duration: 5.5, rotateRange: [0, 7, 0], delay: 0.6, opacity: 0.8 },

  // Spotify Section
  { id: 4, src: flower3, topPercent: 18, left: '2%', width: 'w-32 sm:w-48', duration: 6.8, rotateRange: [0, -6, 0], delay: 0.2, opacity: 0.85 },
  { id: 5, src: flower4, topPercent: 24, left: '85%', width: 'w-28 sm:w-44', duration: 7.2, rotateRange: [0, 8, 0], delay: 0.5, opacity: 0.85 },
  { id: 6, src: flower1, topPercent: 29, left: '-3%', width: 'w-36 sm:w-52', duration: 6.2, rotateRange: [0, -4, 0], delay: 0.8, opacity: 0.8 },

  // Scratch Cards Section
  { id: 7, src: flower2, topPercent: 36, left: '87%', width: 'w-32 sm:w-48', duration: 7.5, rotateRange: [0, 6, 0], delay: 0.4, opacity: 0.85 },
  { id: 8, src: flower5, topPercent: 41, left: '1%', width: 'w-28 sm:w-44', duration: 6.5, rotateRange: [0, -7, 0], delay: 0.7, opacity: 0.85 },
  { id: 9, src: flower3, topPercent: 47, left: '86%', width: 'w-36 sm:w-52', duration: 8, rotateRange: [0, 5, 0], delay: 0.1, opacity: 0.8 },

  // Countdown Section
  { id: 10, src: flower4, topPercent: 54, left: '-2%', width: 'w-32 sm:w-48', duration: 6.6, rotateRange: [0, -6, 0], delay: 0.3, opacity: 0.85 },
  { id: 11, src: flower1, topPercent: 60, left: '88%', width: 'w-28 sm:w-44', duration: 7.8, rotateRange: [0, 8, 0], delay: 0.6, opacity: 0.85 },
  { id: 12, src: flower2, topPercent: 66, left: '2%', width: 'w-36 sm:w-52', duration: 6.2, rotateRange: [0, -5, 0], delay: 0.9, opacity: 0.8 },

  // Memory Booth Gallery
  { id: 13, src: flower5, topPercent: 73, left: '86%', width: 'w-32 sm:w-48', duration: 7.4, rotateRange: [0, 7, 0], delay: 0.2, opacity: 0.85 },
  { id: 14, src: flower3, topPercent: 79, left: '-3%', width: 'w-36 sm:w-52', duration: 6.8, rotateRange: [0, -6, 0], delay: 0.5, opacity: 0.85 },
  { id: 15, src: flower4, topPercent: 86, left: '87%', width: 'w-28 sm:w-44', duration: 8.2, rotateRange: [0, 6, 0], delay: 0.8, opacity: 0.8 },

  // Final Section
  { id: 16, src: flower1, topPercent: 93, left: '2%', width: 'w-36 sm:w-52', duration: 7, rotateRange: [0, -7, 0], delay: 0.4, opacity: 0.85 },
  { id: 17, src: flower2, topPercent: 97, left: '86%', width: 'w-32 sm:w-48', duration: 6.4, rotateRange: [0, 5, 0], delay: 0.7, opacity: 0.85 },
];

export const FloatingFlowers: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {FLOWERS_CONFIG.map((flower) => (
        <motion.div
          key={flower.id}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: flower.opacity, scale: 1 }}
          viewport={{ once: true }}
          animate={{
            y: [0, -14, 0],
            rotate: flower.rotateRange
          }}
          transition={{
            y: { duration: flower.duration, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: flower.duration + 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`absolute drop-shadow-[0_12px_30px_rgba(232,122,144,0.25)] select-none ${flower.width}`}
          style={{
            top: `${flower.topPercent * 6.5}vh`, // Use vh instead of % so they don't jump when main container expands
            left: flower.left
          }}
        >
          <img src={flower.src} alt="Romantic Flower Accent" className="w-full h-auto" />
        </motion.div>
      ))}
    </div>
  );
};
