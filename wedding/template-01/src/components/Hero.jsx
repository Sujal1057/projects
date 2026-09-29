import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-section" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Background mimicking the garden with lotus pond */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '30%', background: 'linear-gradient(to top, #6b8d7a, transparent)', zIndex: 1 }}></div>

      {/* The main Arch */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="main-arch"
        style={{
           position: 'relative',
           width: '90%',
           maxWidth: '550px',
           height: '85vh',
           marginTop: '2vh',
           border: '3px solid var(--color-gold)',
           borderTopLeftRadius: '50% 15%',
           borderTopRightRadius: '50% 15%',
           backgroundColor: 'rgba(244, 239, 223, 0.5)',
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           padding: '3rem 2rem',
           zIndex: 10,
           boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
           backdropFilter: 'blur(5px)'
        }}
      >
        <h2 style={{ fontSize: '4rem', color: 'var(--color-gold)', marginBottom: '1rem', fontWeight: '400', lineHeight: 1 }}>ॐ</h2>
        <p className="subheading" style={{ fontSize: '1.2rem', color: 'var(--color-gold-light)', letterSpacing: '2px' }}>॥ श्री गणेशाय नमः ॥</p>
        <div className="divider-line" style={{ height: '30px' }}></div>
        <p className="subheading" style={{ fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center', letterSpacing: '3px', lineHeight: '1.8', color: 'var(--color-dark-green)' }}>
          WITH THE BLESSINGS OF OUR FAMILIES<br />
          WE JOYFULLY INVITE YOU TO<br />
          CELEBRATE THE WEDDING OF
        </p>
        
        <h1 style={{ fontSize: '4rem', color: 'var(--color-dark-green)', marginTop: '2.5rem', fontWeight: 600 }}>AARAV</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '0.5rem 0' }}>
           <span style={{ height: '1px', width: '40px', background: 'var(--color-gold)' }}></span>
           <p className="subheading" style={{ fontSize: '2.5rem', color: 'var(--color-gold)', fontStyle: 'italic' }}>and</p>
           <span style={{ height: '1px', width: '40px', background: 'var(--color-gold)' }}></span>
        </div>
        <h1 style={{ fontSize: '4rem', color: 'var(--color-dark-green)', fontWeight: 600 }}>VAANI</h1>
        
        <p style={{ marginTop: 'auto', letterSpacing: '4px', fontSize: '0.9rem', color: 'var(--color-dark-green)', marginBottom: '1rem' }}>#AaravWedsVaani</p>
        
      </motion.div>

      {/* Bouncing Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', bottom: '2%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}
      >
        <ChevronDown size={30} color="var(--color-gold)" strokeWidth={1} />
      </motion.div>
    </section>
  );
};

export default Hero;
