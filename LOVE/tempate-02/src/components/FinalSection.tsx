import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalSectionProps {
  onReplay: () => void;
}

export const FinalSection: React.FC<FinalSectionProps> = ({ onReplay }) => {

  const handleReplayClick = () => {
    // Trigger celebratory confetti burst before replay
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F4A9BF', '#D4AF37', '#DE4778', '#FFFDF9']
    });

    setTimeout(() => {
      onReplay();
    }, 400);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 text-center overflow-hidden bg-transparent">

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center my-auto">
        
        {/* Heart Icon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-16 h-16 rounded-full glass-panel border border-gold-300/60 flex items-center justify-center shadow-gold-glow mb-8"
        >
          <Heart className="w-8 h-8 text-love-600 fill-love-500 animate-pulse" />
        </motion.div>

        {/* Final Text Lines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="font-serif italic text-2xl sm:text-4xl text-burgundy font-semibold leading-relaxed tracking-wide">
            "No matter where life takes us...
          </p>

          <p className="font-serif text-3xl sm:text-5xl text-love-900 font-bold tracking-tight">
            I'll always choose you."
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <Heart className="w-6 h-6 text-love-500 fill-love-400" />
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
        </motion.div>

        {/* Replay Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14"
        >
          <button
            onClick={handleReplayClick}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-love-600 via-burgundy to-love-700 text-white font-serif text-base tracking-wider uppercase shadow-gold-glow hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gold-300/50 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-gold-300 group-hover:-rotate-180 transition-transform duration-700" />
            <span className="font-semibold">Replay Story</span>
            <Sparkles className="w-4 h-4 text-gold-300 animate-pulse" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
