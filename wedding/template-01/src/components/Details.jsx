import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Music, MapPin, Sparkles, Flower2 } from 'lucide-react';

const detailsData = [
  {
    title: 'WEDDING',
    Icon: HeartHandshake,
    lines: ['24th NOV 2025', 'Monday', '07:00 PM Onwards']
  },
  {
    title: 'RECEPTION',
    Icon: Music,
    lines: ['25th NOV 2025', 'Tuesday', '07:00 PM Onwards']
  },
  {
    title: 'VENUE',
    Icon: MapPin,
    lines: ['The Grand Palace', 'Udaipur, Rajasthan', 'India']
  },
  {
    title: 'DRESS CODE',
    Icon: Sparkles,
    lines: ['Traditional', 'Indian Attire', '']
  }
];

const Details = () => {
  return (
    <section className="details-section" style={{ padding: '5rem 1rem' }}>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ fontSize: '2.5rem', color: 'var(--color-gold-light)', marginBottom: '4rem' }}
      >
        Wedding Details
      </motion.h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem',
        width: '100%',
        maxWidth: '1200px'
      }}>
        {detailsData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.8 }}
            style={{
              width: '250px',
              backgroundColor: 'rgba(244, 239, 223, 0.5)',
              border: '1px solid var(--color-gold)',
              borderTopLeftRadius: '50% 20%',
              borderTopRightRadius: '50% 20%',
              padding: '2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(5px)'
            }}
          >
            {/* Inner Border */}
            <div style={{
              position: 'absolute',
              top: '8px', left: '8px', right: '8px', bottom: '8px',
              border: '1px solid rgba(194, 157, 88, 0.4)',
              borderTopLeftRadius: '50% 15%',
              borderTopRightRadius: '50% 15%',
              pointerEvents: 'none'
            }}></div>

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
               <item.Icon size={50} color="var(--color-gold)" strokeWidth={1} />
            </div>
            
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-gold)', paddingBottom: '0.5rem' }}>
              {item.title}
            </h3>
            
            {item.lines.map((line, i) => (
              <p key={i} className="subheading" style={{ color: 'var(--color-dark-green)', fontSize: '1.1rem', marginBottom: '0.3rem', fontWeight: i === 0 ? '600' : '400' }}>
                {line}
              </p>
            ))}
          </motion.div>
        ))}
      </div>
      
      {/* Decorative Lotus at bottom */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}
      >
        <Flower2 size={50} color="var(--color-gold-light)" strokeWidth={1} />
      </motion.div>
    </section>
  );
};

export default Details;
