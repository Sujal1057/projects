import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, RotateCw, Maximize } from 'lucide-react';

interface DeviceOrientationPromptProps {
  onStart: () => void;
  isPortrait: boolean;
}

export const DeviceOrientationPrompt: React.FC<DeviceOrientationPromptProps> = ({ onStart, isPortrait }) => {
  const handleStart = () => {
    // Attempt to request fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {
        // Ignore errors if fullscreen fails
      });
    }
    onStart();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FFFFFF] flex items-center justify-center p-6 text-[#5C1425] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-love-200/50 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold-200/50 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card paper-texture p-8 sm:p-12 rounded-2xl max-w-sm w-full text-center relative z-10 shadow-2xl border border-cream-300 flex flex-col items-center"
      >
        <div className="relative mb-8">
          <motion.div
            animate={isPortrait ? { rotate: [0, 90, 90, 0], scale: [1, 1.1, 1.1, 1] } : { scale: [1, 1.05, 1] }}
            transition={isPortrait ? { duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-gradient-to-br from-love-100 to-love-200 rounded-full flex items-center justify-center shadow-inner border border-love-300/50"
          >
            {isPortrait ? (
              <Smartphone className="w-10 h-10 text-love-700" />
            ) : (
              <Maximize className="w-10 h-10 text-love-700" />
            )}
          </motion.div>
          {isPortrait && (
            <motion.div 
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute -bottom-2 -right-2 bg-gold-100 rounded-full p-1.5 shadow-md border border-gold-300"
            >
              <RotateCw className="w-4 h-4 text-gold-600" />
            </motion.div>
          )}
        </div>

        <h2 className="font-serif italic text-2xl text-burgundy font-bold mb-4">
          {isPortrait ? "Rotate Your Device" : "Ready For Magic?"}
        </h2>
        
        <p className="text-love-800/80 mb-8 font-medium leading-relaxed">
          {isPortrait 
            ? "For the most beautiful experience, please turn your phone sideways (landscape mode)."
            : "You're in landscape mode! Let's enter full screen for the best experience."}
        </p>

        <button
          onClick={handleStart}
          disabled={isPortrait}
          className={`w-full py-3.5 rounded-full font-serif font-semibold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
            isPortrait 
              ? "bg-cream-300 text-love-800/50 cursor-not-allowed" 
              : "bg-gradient-to-r from-love-600 to-burgundy text-white shadow-[0_4px_15px_rgba(222,71,120,0.3)] hover:shadow-[0_6px_20px_rgba(222,71,120,0.5)] hover:-translate-y-0.5 border border-love-400"
          }`}
        >
          {isPortrait ? "Waiting for rotation..." : "Start Experience"}
          {!isPortrait && <Maximize className="w-4 h-4" />}
        </button>
      </motion.div>
    </div>
  );
};
