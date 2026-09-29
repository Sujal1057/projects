import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroSectionProps {
  onComplete: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent px-6 text-center overflow-hidden"
    >

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0.94, 1, 1, 0.98],
          y: [10, 0, 0, -10]
        }}
        transition={{
          duration: 2.5,
          times: [0, 0.35, 0.8, 1],
          ease: "easeInOut"
        }}
        className="relative z-10 max-w-lg"
      >
        <p className="font-serif italic text-2xl sm:text-3xl text-love-900 leading-relaxed font-normal tracking-wide drop-shadow-sm">
          "A little piece of my heart is waiting for you..."
        </p>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60px" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6"
        />
      </motion.div>
    </motion.div>
  );
};
