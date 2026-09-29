import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Film, MapPin, Calendar } from 'lucide-react';
import { MEMORIES } from '../data/memories';
import { MemoryItem } from '../types';

export const MemoryBooth: React.FC = () => {
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);

  // Precompute random tilts for each polaroid frame (-6deg to +6deg)
  const polaroidRotations = useMemo(() => {
    const angles = [-5, 4, -3, 6, -4, 3, -6, 5, -2, 4, -5, 3, -4, 6, -3];
    return MEMORIES.map((_, i) => angles[i % angles.length]);
  }, []);

  const openLightbox = (index: number) => {
    setSelectedMemoryIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMemoryIndex(null);
  };

  const goToPrev = () => {
    if (selectedMemoryIndex === null) return;
    setSelectedMemoryIndex((prev) => (prev === 0 ? MEMORIES.length - 1 : (prev as number) - 1));
  };

  const goToNext = () => {
    if (selectedMemoryIndex === null) return;
    setSelectedMemoryIndex((prev) => (prev === MEMORIES.length - 1 ? 0 : (prev as number) + 1));
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMemoryIndex === null) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMemoryIndex]);

  const currentMemory: MemoryItem | null =
    selectedMemoryIndex !== null ? MEMORIES[selectedMemoryIndex] : null;

  return (
    <section className="relative py-28 px-4 sm:px-8 bg-transparent overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-gold-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-love-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-panel border border-love-200/60 text-love-800 text-xs tracking-widest uppercase font-semibold mb-4 shadow-glass">
            <Film className="w-3.5 h-3.5 text-gold-500" />
            Our Memory Gallery
          </span>
          <h2 className="font-serif italic text-4xl sm:text-6xl text-burgundy font-bold tracking-tight">
            Memory Booth
          </h2>
          <p className="font-serif text-sm sm:text-base text-love-800/80 max-w-md mx-auto mt-3 leading-relaxed">
            Every moment captured in time. Tap any polaroid to view in full resolution.
          </p>
        </motion.div>

        {/* Seamless Full-Screen Polaroid Grid with Random Tilts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {MEMORIES.map((memory, index) => {
            const tiltDeg = polaroidRotations[index];

            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 30, rotate: tiltDeg }}
                whileInView={{ opacity: 1, y: 0, rotate: tiltDeg }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                whileHover={{ scale: 1.07, y: -8, rotate: 0, zIndex: 30 }}
                onClick={() => openLightbox(index)}
                className="relative paper-texture p-3.5 rounded-sm shadow-paper border border-cream-300/90 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:border-gold-400/80"
              >
                {/* Gold Metallic Tape Accent at Top Center */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-11 h-4 bg-gradient-to-r from-gold-300/70 via-gold-200/90 to-gold-300/70 border border-gold-400/50 shadow-xs z-20 opacity-85 group-hover:opacity-100 transition-opacity" />

                {/* Photo Frame Container */}
                <div className="relative aspect-[4/3] bg-love-50 overflow-hidden rounded-xs border border-cream-200 shadow-inner">
                  <img
                    src={memory.imageUrl}
                    alt={memory.caption}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Hover Shimmer Light Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Caption & Date */}
                <div className="pt-3 text-center">
                  <p className="font-handwriting text-love-900 text-base sm:text-lg font-bold tracking-wide truncate">
                    {memory.caption}
                  </p>
                  <p className="text-[10px] text-love-400 font-sans tracking-widest uppercase mt-0.5 font-semibold">
                    {memory.date}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Gallery Footer Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-24 max-w-xl mx-auto"
        >
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6" />
          <p className="font-serif italic text-2xl sm:text-3xl text-burgundy font-normal leading-relaxed">
            "Every picture tells a story...<br />
            <span className="font-handwriting text-3xl sm:text-5xl text-love-700 font-bold block mt-3 drop-shadow-sm">
              My favorite story is us."
            </span>
          </p>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-6" />
        </motion.div>

      </div>

      {/* Fullscreen Apple-Style Lightbox Modal */}
      <AnimatePresence>
        {selectedMemoryIndex !== null && currentMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 border border-white/20 shadow-lg cursor-pointer"
              title="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 sm:left-8 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 border border-white/20 shadow-lg cursor-pointer hover:scale-110"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 sm:right-8 p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50 border border-white/20 shadow-lg cursor-pointer hover:scale-110"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Polaroid Card */}
            <motion.div
              key={currentMemory.id}
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md sm:max-w-lg w-full paper-texture p-4 sm:p-7 rounded-lg shadow-2xl border border-cream-200 my-auto"
            >
              {/* Photo Display */}
              <div className="relative aspect-[4/3] rounded-xs overflow-hidden border border-cream-300 shadow-md">
                <img
                  src={currentMemory.imageUrl}
                  alt={currentMemory.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Lightbox Caption Details */}
              <div className="pt-5 text-center">
                <h3 className="font-serif text-xl sm:text-2xl text-love-900 font-bold">
                  {currentMemory.title}
                </h3>
                <p className="font-handwriting text-3xl sm:text-4xl text-burgundy font-bold mt-1">
                  {currentMemory.caption}
                </p>

                {/* Metadata Pills */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-100/60 text-love-800 text-xs font-serif">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    {currentMemory.date}
                  </span>

                  {currentMemory.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-love-100/60 text-love-800 text-xs font-serif">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" />
                      {currentMemory.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Counter Indicator */}
              <div className="mt-5 text-center border-t border-love-200/50 pt-3">
                <span className="text-[11px] font-mono tracking-widest text-love-400 uppercase">
                  {selectedMemoryIndex + 1} / {MEMORIES.length}
                </span>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
