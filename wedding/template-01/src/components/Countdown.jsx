import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 45, hours: 12, minutes: 36, seconds: 8 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <section className="countdown-section" style={{ padding: '4rem 1rem' }}>
      
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ fontSize: '2rem', color: 'var(--color-gold-light)', marginBottom: '3rem', borderBottom: '1px solid var(--color-gold)', paddingBottom: '1rem' }}
      >
        Countdown To Our Big Day
      </motion.h2>

      <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: '0.5rem', width: '100%', marginBottom: '2rem' }}>
        {timeBlocks.map((block, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            style={{
              flex: '1 1 0',
              minWidth: '65px',
              maxWidth: '90px',
              height: '110px',
              border: '2px solid var(--color-gold)',
              borderTopLeftRadius: '50% 20%',
              borderTopRightRadius: '50% 20%',
              backgroundColor: 'rgba(244, 239, 223, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
              position: 'relative',
              backdropFilter: 'blur(3px)'
            }}
          >
            <span style={{ fontSize: '1.8rem', color: 'var(--color-ivory)', fontFamily: 'var(--font-heading)' }}>
              {block.value.toString().padStart(2, '0')}
            </span>
            <span style={{ color: 'var(--color-gold-light)', fontSize: '0.7rem', marginTop: '0.5rem', letterSpacing: '1px' }}>
              {block.label}
            </span>
          </motion.div>
        ))}
      </div>
      
      {/* Small decoration */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Crown size={40} color="var(--color-gold)" strokeWidth={1} />
      </div>
    </section>
  );
};

export default Countdown;
