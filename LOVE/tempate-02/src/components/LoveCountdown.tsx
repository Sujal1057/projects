import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Sparkles } from 'lucide-react';

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const LoveCountdown: React.FC = () => {
  // Start date default (can be adjusted by user or set to memorable date e.g. Oct 14, 2023)
  const [startDate] = useState<Date>(new Date('2023-10-14T00:00:00'));
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = Math.max(0, now.getTime() - startDate.getTime());

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  const renderTimeUnit = (value: number, label: string) => {
    const formattedValue = value < 10 ? `0${value}` : `${value}`;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-16 sm:w-24 h-20 sm:h-28 rounded-2xl glass-card border border-white/80 flex items-center justify-center shadow-glass overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-love-100/30 pointer-events-none" />

          {/* Animated Number flip */}
          <AnimatePresence mode="popLayout">
            <motion.span
              key={formattedValue}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-serif text-3xl sm:text-5xl font-bold text-burgundy tracking-tight relative z-10"
            >
              {formattedValue}
            </motion.span>
          </AnimatePresence>

          {/* Card Horizontal Separator Line */}
          <div className="absolute top-1/2 inset-x-0 h-[1px] bg-love-200/50 pointer-events-none" />
        </div>

        <span className="mt-3 font-serif italic text-xs sm:text-sm text-love-800 tracking-wider uppercase font-semibold">
          {label}
        </span>
      </div>
    );
  };

  return (
    <section className="relative py-24 px-4 bg-transparent overflow-hidden">
      {/* Floating Tiny Hearts Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 9) % 95}%`,
              y: '100%',
              opacity: 0.2,
              scale: 0.5 + ((i % 3) * 0.2)
            }}
            animate={{
              y: '-10%',
              opacity: [0.2, 0.7, 0.2],
              scale: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 8 + (i % 5) * 2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "linear"
            }}
            className="absolute text-love-400/40"
          >
            <Heart className="w-5 h-5 fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-3xl mx-auto z-10 text-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-panel border border-love-200/50 text-love-800 text-xs tracking-widest uppercase font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Every Second Counts
          </span>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-burgundy font-bold tracking-tight">
            We've Been Together
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3 text-love-700 font-serif text-sm">
            <Calendar className="w-4 h-4 text-gold-500" />
            <span>Since October 14, 2023</span>
          </div>
        </motion.div>

        {/* Live Counters */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 sm:gap-6"
        >
          {renderTimeUnit(timeElapsed.days, 'Days')}
          <span className="text-2xl text-gold-500 font-serif font-bold self-start mt-6">:</span>
          {renderTimeUnit(timeElapsed.hours, 'Hours')}
          <span className="text-2xl text-gold-500 font-serif font-bold self-start mt-6">:</span>
          {renderTimeUnit(timeElapsed.minutes, 'Minutes')}
          <span className="text-2xl text-gold-500 font-serif font-bold self-start mt-6">:</span>
          {renderTimeUnit(timeElapsed.seconds, 'Seconds')}
        </motion.div>

        {/* Subtitle Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-handwriting text-2xl sm:text-3xl text-love-900 mt-12 tracking-wide"
        >
          "And I would choose you in a hundred lifetimes..."
        </motion.p>

      </div>
    </section>
  );
};
