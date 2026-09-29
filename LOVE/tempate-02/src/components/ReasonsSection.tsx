import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';
import surpriseBoxImg from '../../assets/suprisebox.jpg';

interface LoveReason {
  id: number;
  title: string;
  text: string;
}

const REASONS: LoveReason[] = [
  {
    id: 1,
    title: "Reason #1",
    text: "Your contagious smile that brightens up even my darkest days."
  },
  {
    id: 2,
    title: "Reason #2",
    text: "How you make the simplest ordinary moments feel like unforgettable adventures."
  },
  {
    id: 3,
    title: "Reason #3",
    text: "The way your eyes sparkle whenever you talk about your passion & dreams."
  },
  {
    id: 4,
    title: "Reason #4",
    text: "Your endless warmth, kindness, and how deeply you care for me."
  },
  {
    id: 5,
    title: "Reason #5",
    text: "Because with you in my arms, I am truly home."
  },
  {
    id: 6,
    title: "Reason #6",
    text: "Because you inspire me to be the absolute best version of myself."
  }
];

interface ScratchCardItemProps {
  reason: LoveReason;
  index: number;
  onScratched: (id: number) => void;
}

const ScratchCardItem: React.FC<ScratchCardItemProps> = ({ reason, index, onScratched }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = container.clientWidth);
    const height = (canvas.height = container.clientHeight);

    // Draw suprisebox.jpg image as the Scratch Foil Cover
    const img = new Image();
    img.src = surpriseBoxImg;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);

      // Add a subtle metallic gold gradient overlay banner with text
      const overlayGradient = ctx.createLinearGradient(0, height * 0.65, 0, height);
      overlayGradient.addColorStop(0, 'rgba(107, 29, 47, 0.4)');
      overlayGradient.addColorStop(1, 'rgba(107, 29, 47, 0.85)');

      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, height * 0.65, width, height * 0.35);

      // Draw Scratch Instruction Text
      ctx.fillStyle = '#FFFDF9';
      ctx.font = 'bold 14px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ Scratch Here ✨', width / 2, height * 0.82);
    };
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage(ctx, canvas.width, canvas.height);
  };

  const checkScratchPercentage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (isRevealed) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let clearPixels = 0;

    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] === 0) {
        clearPixels++;
      }
    }

    const totalSamples = pixels.length / 32;
    const percentage = (clearPixels / totalSamples) * 100;

    if (percentage > 38) {
      setIsRevealed(true);
      ctx.clearRect(0, 0, width, height);
      onScratched(reason.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isScratching) return;
    if (e.touches[0]) scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      ref={containerRef}
      className="relative h-[270px] w-full rounded-2xl shadow-paper border border-cream-300/80 overflow-hidden select-none"
    >
      {/* Hidden Love Reason Layer (Underneath Canvas) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EE] p-5 flex flex-col justify-between border-2 border-gold-300/60 rounded-2xl paper-texture">
        <div className="flex items-center justify-between text-gold-600 border-b border-gold-300/40 pb-2">
          <span className="font-serif text-xs font-bold uppercase tracking-wider text-burgundy">
            {reason.title}
          </span>
          <Unlock className="w-3.5 h-3.5 text-gold-500" />
        </div>

        <div className="my-auto text-center py-2 px-1">
          <p className="font-handwriting text-xl sm:text-2xl text-love-900 leading-relaxed font-bold">
            "{reason.text}"
          </p>
        </div>

        <div className="flex justify-center border-t border-gold-300/40 pt-2">
          <Heart className="w-4 h-4 text-love-500 fill-love-400 animate-pulse" />
        </div>
      </div>

      {/* Interactive Canvas Overlay featuring suprisebox.jpg as the Scratch Cover */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 z-20 cursor-pointer touch-none rounded-2xl shadow-inner"
        />
      )}
    </motion.div>
  );
};

export const ReasonsSection: React.FC = () => {
  const [scratchedIds, setScratchedIds] = useState<number[]>([]);

  const handleScratched = (id: number) => {
    if (!scratchedIds.includes(id)) {
      const updated = [...scratchedIds, id];
      setScratchedIds(updated);

      // Trigger celebratory confetti burst when all 6 are scratched off
      if (updated.length === 6) {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#DE4778', '#FFFDF9', '#F3D458']
        });
      }
    }
  };

  return (
    <section className="relative py-24 px-4 bg-transparent overflow-hidden">
      <div className="relative max-w-6xl mx-auto z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-panel border border-love-200/60 text-love-800 text-xs tracking-widest uppercase font-semibold mb-4 shadow-glass">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Surprise Scratch Cards
          </span>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-burgundy font-bold tracking-tight">
            Reasons Why I Love You ❤️
          </h2>
          <p className="font-serif text-sm sm:text-base text-love-800/80 max-w-md mx-auto mt-3">
            Swipe or drag across the surprise box cover to scratch it off and reveal the secret note underneath!
          </p>
        </motion.div>

        {/* 6 Scratch Cards using suprisebox.jpg as the Top Cover */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {REASONS.map((reason, index) => (
            <ScratchCardItem
              key={reason.id}
              reason={reason}
              index={index}
              onScratched={handleScratched}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
