import React from 'react';
import { motion } from 'framer-motion';
import { Image, Map, Mail, Heart } from 'lucide-react';

const linkItems = [
  { title: 'Gallery', subtitle: 'Glimpses of our journey', Icon: Image },
  { title: 'Venue', subtitle: 'Find location & directions', Icon: Map },
  { title: 'RSVP', subtitle: "Let us know you're coming", Icon: Mail },
  { title: 'Blessings', subtitle: 'Send your love & good wishes', Icon: Heart }
];

const FooterLinks = () => {
  return (
    <section className="footer-links-section" style={{ padding: '5rem 1rem' }}>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1000px'
      }}>
        {linkItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            style={{
              width: '280px',
              backgroundColor: 'rgba(244, 239, 223, 0.5)',
              border: '1px solid var(--color-gold)',
              borderRadius: '20px',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}
            whileHover={{ scale: 1.05, borderColor: 'var(--color-gold)' }}
          >
            {/* Inner dashed border */}
            <div style={{
              position: 'absolute',
              top: '10px', left: '10px', right: '10px', bottom: '10px',
              border: '1px dashed rgba(194, 157, 88, 0.5)',
              pointerEvents: 'none'
            }}></div>

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <item.Icon size={40} color="var(--color-gold)" strokeWidth={1} />
            </div>
            
            <h4 style={{ color: 'var(--color-dark-green)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h4>
            
            <p className="subheading" style={{ color: 'var(--color-text-dark)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {item.subtitle}
            </p>
            
            <div style={{
              width: '30px', height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-ivory)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.2rem',
              marginTop: 'auto'
            }}>
              ➔
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FooterLinks;
