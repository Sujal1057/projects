import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const GlobalAnimations = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate static initial petals to animate
    const newPetals = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      animationDuration: Math.random() * 5 + 5 + 's',
      animationDelay: Math.random() * 5 + 's',
      size: Math.random() * 10 + 10 + 'px',
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="global-animations">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            y: '-10vh',
            x: 0,
            rotate: petal.rotation,
            opacity: 0.8,
          }}
          animate={{
            y: '110vh',
            x: Math.random() > 0.5 ? 100 : -100,
            rotate: petal.rotation + 360,
            opacity: 0,
          }}
          transition={{
            duration: parseFloat(petal.animationDuration),
            delay: parseFloat(petal.animationDelay),
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            left: petal.left,
            width: petal.size,
            height: petal.size,
            backgroundColor: '#ffb6c1', // Soft pink petal color
            borderRadius: '50% 0 50% 50%',
            boxShadow: '0 0 5px rgba(255,182,193,0.5)',
          }}
        />
      ))}
    </div>
  );
};

export default GlobalAnimations;
