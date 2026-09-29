import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircleHeart, Heart, Infinity } from 'lucide-react';

const storyItems = [
  { year: '2020', title: 'We Met', Icon: Sparkles },
  { year: '2021', title: 'We Connected', Icon: MessageCircleHeart },
  { year: '2022', title: 'We Fell In Love', Icon: Heart },
  { year: '2024', title: 'Forever Begins', Icon: Infinity },
];

const Story = () => {
  return (
    <section className="story-section" style={{ color: 'var(--color-ivory)', padding: '6rem 1rem' }}>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ fontSize: '3rem', color: 'var(--color-gold-light)' }}
      >
        Our Story
      </motion.h2>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginTop: '1rem', letterSpacing: '1px', fontSize: '0.9rem' }}
      >
        <p>Two souls, one journey.</p>
        <p>A beautiful beginning to forever.</p>
      </motion.div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', marginTop: '5rem', display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Horizontal Timeline Line */}
        <div style={{ position: 'absolute', top: '70%', left: '5%', width: '90%', height: '1px', backgroundColor: 'var(--color-gold)', zIndex: 1 }}></div>

        {storyItems.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}
          >
            {/* Small Arch Window */}
            <div style={{
              width: '80px',
              height: '110px',
              border: '1px solid var(--color-gold)',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              backgroundColor: 'rgba(244, 239, 223, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '1rem',
              backdropFilter: 'blur(5px)'
            }}>
              <item.Icon size={40} color="var(--color-gold)" strokeWidth={1} />
            </div>

            {/* Timeline Dot */}
            <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-gold)', borderRadius: '50%', marginBottom: '1rem' }}></div>

            {/* Text */}
            <p style={{ color: 'var(--color-gold-light)', fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>{item.year}</p>
            <p style={{ color: 'var(--color-ivory)', fontSize: '0.8rem', letterSpacing: '1px', marginTop: '0.3rem', textAlign: 'center' }}>{item.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Story;
