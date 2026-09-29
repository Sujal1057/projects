import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';

interface LoveLetterSectionProps {
  onComplete: () => void;
}

const LETTER_PAGE_1 = `Dear Love,

From the day you entered my life,
everything became brighter.

Thank you for every smile,
every laugh,
every memory.

No matter what happens,
I'll always choose you.

Forever yours ❤️`;

const LETTER_PAGE_2 = `My Dearest,

Every moment with you feels like a dream I never want to wake up from.

You bring warmth to my coldest days and light to my darkest moments.

Thank you for being my anchor, my secret keeper, and my best friend.

No matter where life takes us, my heart will always belong to you.

Yours always & forever ❤️`;

export const LoveLetterSection: React.FC<LoveLetterSectionProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [typedText, setTypedText] = useState('');
  const [isPage1Finished, setIsPage1Finished] = useState(false);
  const [isPage2Finished, setIsPage2Finished] = useState(false);

  // Typewriter effect for Page 1
  useEffect(() => {
    if (currentPage !== 1) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= LETTER_PAGE_1.length) {
        setTypedText(LETTER_PAGE_1.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsPage1Finished(true);
      }
    }, 42);

    return () => clearInterval(interval);
  }, [currentPage]);

  // Typewriter effect for Page 2
  useEffect(() => {
    if (currentPage !== 2) return;

    setTypedText('');
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= LETTER_PAGE_2.length) {
        setTypedText(LETTER_PAGE_2.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsPage2Finished(true);
        // UNLOCK SCROLL ONLY WHEN PAGE 2 FINISHES
        onComplete();
      }
    }, 42);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleNextPage = () => {
    if (!isPage1Finished) return;
    setCurrentPage(2);
  };

  const handleScrollDown = () => {
    const nextElem = document.getElementById('playlist-section');
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-transparent overflow-hidden select-none">

      {/* 3D Paper Container with Flip Transition between Page 1 and Page 2 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, rotateY: currentPage === 2 ? -90 : -60, rotateX: currentPage === 2 ? 0 : -30, scale: 0.88 }}
          animate={{ opacity: 1, rotateY: 0, rotateX: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 90, scale: 0.88 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative w-full max-w-lg paper-texture p-8 sm:p-12 rounded-lg border border-cream-300/80 shadow-2xl animate-soft-float my-auto"
        >
          {/* Paper Top Header Accent */}
          <div className="flex items-center justify-between border-b border-love-200/60 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span className="font-serif italic text-xs tracking-widest text-love-700 uppercase font-semibold">
                Letter Page {currentPage} of 2
              </span>
            </div>
            <Heart className="w-5 h-5 text-love-500 fill-love-400 animate-pulse" />
          </div>

          {/* Typewriter Body */}
          <div className="h-[380px] sm:h-[420px] flex flex-col justify-between">
            <pre className="font-serif text-base sm:text-lg text-love-900 leading-relaxed whitespace-pre-wrap tracking-wide font-normal">
              {typedText}
              {((currentPage === 1 && !isPage1Finished) || (currentPage === 2 && !isPage2Finished)) && (
                <span className="inline-block w-2 h-5 bg-gold-500 ml-1 animate-pulse" />
              )}
            </pre>

            {/* Next Letter Page Button (Appears when Page 1 finishes typing) */}
            {currentPage === 1 && isPage1Finished && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-6 flex justify-end"
              >
                <button
                  onClick={handleNextPage}
                  className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-love-600 to-burgundy text-white font-serif text-sm tracking-wider shadow-gold-glow hover:scale-105 transition-all duration-300 cursor-pointer border border-gold-300/50"
                >
                  <span className="font-semibold">Read Next Page</span>
                  <ArrowRight className="w-4 h-4 text-gold-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Paper Bottom Seal Accent */}
          <div className="border-t border-love-200/60 pt-4 mt-6 flex justify-between items-center">
            <span className="text-xs font-serif text-love-500/80 italic">
              {currentPage === 1 ? "Page 1" : "Page 2"}
            </span>
            <div className="text-right">
              <span className="font-handwriting text-2xl text-burgundy block">
                {currentPage === 1 ? "Forever Yours" : "Always & Forever"}
              </span>
            </div>
          </div>

          {/* Floating Paper Fold Crease Details */}
          <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-cream-300/40 pointer-events-none" />
          <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-cream-300/40 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Scroll Down Prompt Indicator (Only appears AFTER Page 2 is completely finished) */}
      {currentPage === 2 && isPage2Finished && (
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { duration: 0.6 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          onClick={handleScrollDown}
          className="mt-8 flex flex-col items-center gap-1.5 text-love-800 hover:text-love-600 transition-colors group cursor-pointer z-10"
        >
          <span className="font-serif text-xs tracking-widest uppercase font-medium">Scroll to explore our story</span>
          <div className="p-2 rounded-full glass-panel border border-love-200/50 group-hover:border-gold-400 shadow-glass">
            <ChevronDown className="w-4 h-4 text-love-600" />
          </div>
        </motion.button>
      )}
    </div>
  );
};
