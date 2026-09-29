import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  type: 'heart' | 'sparkle';
  color: string;
}

export const ClickSparkles: React.FC = () => {
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const colors = ['#E87A90', '#D4AF37', '#DE4778', '#F3D458', '#FFFDF9'];
      const newParticles: SparkleParticle[] = [];

      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + (Math.random() * 0.5);
        const distance = 25 + Math.random() * 35;
        
        newParticles.push({
          id: Date.now() + i + Math.random(),
          x: clientX + Math.cos(angle) * distance,
          y: clientY + Math.sin(angle) * distance,
          size: Math.random() * 10 + 10,
          rotation: (Math.random() - 0.5) * 60,
          type: i % 2 === 0 ? 'heart' : 'sparkle',
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      setParticles((prev) => [...prev.slice(-18), ...newParticles]);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.4, x: p.x - 12, y: p.y - 12 }}
            animate={{ 
              opacity: 0, 
              scale: 1.2, 
              y: p.y - 65, 
              x: p.x + ((Math.random() - 0.5) * 30),
              rotate: p.rotation 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute"
            style={{ color: p.color }}
          >
            {p.type === 'heart' ? (
              <Heart className="w-5 h-5 fill-current shadow-xs" style={{ width: p.size, height: p.size }} />
            ) : (
              <Sparkles className="w-5 h-5 shadow-xs" style={{ width: p.size, height: p.size }} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
