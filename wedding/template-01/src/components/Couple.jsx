import React from 'react';
import { motion } from 'framer-motion';
import { Flower2 } from 'lucide-react';

const Couple = () => {
  return (
    <section className="couple-section" style={{ padding: '5rem 1rem' }}>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1000px',
        position: 'relative'
      }}>
        
        {/* Scalloped Arch framing the couple and text */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          style={{
            width: '80%', /* Made outer frame much smaller on mobile */
            maxWidth: '650px',
            backgroundColor: 'rgba(244, 239, 223, 0.5)', /* 50% opacity Ivory, 50% bg visible */
            border: '2px solid var(--color-gold)',
            borderRadius: '15px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: '1rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(8px)' /* Increased blur to make text more readable */
          }}
        >
          {/* Inner Scalloped Border Simulation */}
          <div style={{
            position: 'absolute',
            top: '10px', left: '10px', right: '10px', bottom: '10px',
            border: '1px dashed var(--color-gold)',
            borderRadius: '10px',
            pointerEvents: 'none'
          }}></div>

          <div style={{ flex: '1 1 200px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}>
            {/* Couple Placeholder - A beautifully styled inner frame */}
            <div style={{
              width: '100%',
              maxWidth: '200px',
              aspectRatio: '3/4',
              border: '4px solid var(--color-gold)',
              borderTopLeftRadius: '50% 20%',
              borderTopRightRadius: '50% 20%',
              background: 'linear-gradient(to bottom, #d9e1d8, #e8ede3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{ width: '80%', height: '80%', border: '1px solid var(--color-gold)', borderRadius: '50% 20%', opacity: 0.5 }}></div>
              <p style={{ position: 'absolute', bottom: '15px', color: 'var(--color-dark-green)', letterSpacing: '1px', fontSize: '0.7rem' }}>AARAV & VAANI</p>
            </div>
          </div>

          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0.5rem', textAlign: 'center' }}>
            <p className="subheading" style={{ 
              fontSize: '1.2rem', 
              color: 'var(--color-dark-green)', 
              lineHeight: '1.4',
              textShadow: '0 0 15px rgba(244, 239, 223, 0.9), 0 0 5px rgba(244, 239, 223, 0.9)' /* Ivory glow for readability */
            }}>
              We invite you to join us<br/>
              as we celebrate love, tradition<br/>
              and the beginning of our new life<br/>
              together.
            </p>
            
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ height: '1px', width: '20px', background: 'var(--color-gold)' }}></span>
              <span style={{ color: 'var(--color-gold)', fontSize: '1.2rem' }}>✧</span>
              <span style={{ height: '1px', width: '20px', background: 'var(--color-gold)' }}></span>
            </div>

            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
            >
              <Flower2 size={35} color="var(--color-gold)" strokeWidth={1} />
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Couple;
