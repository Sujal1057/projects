import React from 'react';
import { motion } from 'framer-motion';
import { Flower2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-dark-green)', padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ color: 'var(--color-ivory)', fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '1px', textAlign: 'center', width: '100%' }}
      >
        We can't wait to celebrate with you!
      </motion.h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Flower2 size={24} color="var(--color-gold-light)" strokeWidth={1} />
        <p className="subheading" style={{ color: 'var(--color-gold)', fontSize: '1rem', letterSpacing: '2px' }}>Made with Love</p>
        <Flower2 size={24} color="var(--color-gold-light)" strokeWidth={1} />
      </div>
    </footer>
  );
};

export default Footer;
