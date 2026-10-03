import React, { useState } from 'react';
import sunflowerImg from '../assets/sunflower.png';
import birthdayLettering from '../assets/Glossy Black Birthday Lettering.png';
import cloud1Img from '../assets/cloud.png';
import cloud2Img from '../assets/cloud2.png';
import bg2Img from '../assets/bg2.jpg';
import bg3Img from '../assets/bg3.jpg';
import stickerImg from '../assets/sticker.png';
import sticker2Img from '../assets/sticker2.png';
import sticker3Img from '../assets/sticker3.png';
import sticker4Img from '../assets/sticker4.png';
import sticker5Img from '../assets/sticker5.png';
import sticker6Img from '../assets/sticker6.png';
import sticker7Img from '../assets/sticker7.png';
import sticker8Img from '../assets/sticker8.png';
import girlImg from '../assets/girl.png';

// 8 Gallery Photos from assets/gallery
import p1 from '../assets/gallery/p1.jpg';
import p2 from '../assets/gallery/p2.jpg';
import p3 from '../assets/gallery/p3.jpg';
import p4 from '../assets/gallery/p4.jpg';
import p5 from '../assets/gallery/p5.jpg';
import p6 from '../assets/gallery/p6.jpg';
import p7 from '../assets/gallery/p7.jpg';
import p8 from '../assets/gallery/p8.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'gallery' | 'wishes'

  const imgSrc = sunflowerImg || '/sunflower.png';
  const letteringSrc = birthdayLettering || '/Glossy Black Birthday Lettering.png';
  const c1Src = cloud1Img || '/cloud.png';
  const c2Src = cloud2Img || '/cloud2.png';
  const bg2 = bg2Img || '/bg2.jpg';
  const bg3 = bg3Img || '/bg3.jpg';
  const sticker2Src = sticker2Img || '/sticker2.png';
  const girlSrc = girlImg || '/girl.png';

  const galleryPhotos = [
    { id: 1, src: p1 || '/gallery/p1.jpg', title: 'Sweet Moments', rotate: '-4deg', top: '5px', sticker: stickerImg || '/sticker.png', sPos: { top: '-15px', left: '-15px', rotate: '-15deg' } },
    { id: 2, src: p2 || '/gallery/p2.jpg', title: 'Joy & Smiles', rotate: '3deg', top: '-10px', sticker: sticker3Img || '/sticker3.png', sPos: { top: '-15px', right: '-15px', rotate: '10deg' } },
    { id: 3, src: p3 || '/gallery/p3.jpg', title: 'Best Memories', rotate: '-5deg', top: '15px', sticker: sticker4Img || '/sticker4.png', sPos: { bottom: '20px', left: '-20px', rotate: '-20deg' } },
    { id: 4, src: p4 || '/gallery/p4.jpg', title: 'Golden Days', rotate: '5deg', top: '-8px', sticker: sticker5Img || '/sticker5.png', sPos: { bottom: '15px', right: '-15px', rotate: '15deg' } },
    { id: 5, src: p5 || '/gallery/p5.jpg', title: 'Pure Happiness', rotate: '-3deg', top: '8px', sticker: sticker6Img || '/sticker6.png', sPos: { top: '-20px', left: '10px', rotate: '-5deg' } },
    { id: 6, src: p6 || '/gallery/p6.jpg', title: 'Unforgettable', rotate: '4deg', top: '-12px', sticker: sticker7Img || '/sticker7.png', sPos: { bottom: '25px', left: '-10px', rotate: '12deg' } },
    { id: 7, src: p7 || '/gallery/p7.jpg', title: 'Forever Vibes', rotate: '-6deg', top: '12px', sticker: sticker8Img || '/sticker8.png', sPos: { top: '-10px', right: '-10px', rotate: '-10deg' } },
    { id: 8, src: p8 || '/gallery/p8.jpg', title: 'Sunshine Days', rotate: '3deg', top: '-6px', sticker: stickerImg || '/sticker.png', sPos: { bottom: '10px', right: '-20px', rotate: '25deg' } }
  ];

  // 8 stickers for Wishes Page, arranged in a neat responsive grid with slight tilts
  const wishStickers = [
    { id: 1, rotate: '-6deg', wish: 'Happy Birthday! May your dreams come true 🌻' },
    { id: 2, rotate: '4deg', wish: 'Wishing you endless smiles & sunshine ☀️' },
    { id: 3, rotate: '-3deg', wish: 'Stay as sweet and wonderful as you are 💛' },
    { id: 4, rotate: '6deg', wish: 'Cheers to another year of amazing memories 🎉' },
    { id: 5, rotate: '5deg', wish: 'May your day be filled with love & laughter 💫' },
    { id: 6, rotate: '-5deg', wish: 'You deserve all the happiness in the world ✨' },
    { id: 7, rotate: '3deg', wish: 'Keep shining bright like a star ⭐' },
    { id: 8, rotate: '-4deg', wish: 'Here’s to good vibes and big adventures 🎂' }
  ];

  // Dynamic background style based on active tab
  const getContainerStyle = () => {
    if (activeTab === 'gallery') {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${bg2})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      };
    }
    if (activeTab === 'wishes') {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${bg3})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      };
    }
    return {
      backgroundColor: '#9AEDFF'
    };
  };

  const isDarkBg = activeTab === 'gallery' || activeTab === 'wishes';
  const navTextColor = isDarkBg ? '#ffffff' : '#000000';

  return (
    <div
      className="page-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        transition: 'background 0.4s ease',
        ...getContainerStyle()
      }}
    >
      {/* Top Clickable Navigation Bar: home · gallery · wishes */}
      <nav
        style={{
          position: 'absolute',
          top: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '22px',
          letterSpacing: '4px',
          color: navTextColor,
          textTransform: 'lowercase',
          userSelect: 'none'
        }}
      >
        <span
          onClick={() => setActiveTab('home')}
          style={{
            cursor: 'pointer',
            fontWeight: activeTab === 'home' ? '700' : '400',
            opacity: activeTab === 'home' ? 1 : 0.7,
            borderBottom: activeTab === 'home' ? `2px solid ${navTextColor}` : '2px solid transparent',
            paddingBottom: '2px',
            transition: 'all 0.2s ease'
          }}
        >
          home
        </span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span
          onClick={() => setActiveTab('gallery')}
          style={{
            cursor: 'pointer',
            fontWeight: activeTab === 'gallery' ? '700' : '400',
            opacity: activeTab === 'gallery' ? 1 : 0.7,
            borderBottom: activeTab === 'gallery' ? `2px solid ${navTextColor}` : '2px solid transparent',
            paddingBottom: '2px',
            transition: 'all 0.2s ease'
          }}
        >
          gallery
        </span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span
          onClick={() => setActiveTab('wishes')}
          style={{
            cursor: 'pointer',
            fontWeight: activeTab === 'wishes' ? '700' : '400',
            opacity: activeTab === 'wishes' ? 1 : 0.7,
            borderBottom: activeTab === 'wishes' ? `2px solid ${navTextColor}` : '2px solid transparent',
            paddingBottom: '2px',
            transition: 'all 0.2s ease'
          }}
        >
          wishes
        </span>
      </nav>

      {/* Background Animated Drifting Clouds (Shown on Home page) */}
      {activeTab === 'home' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <img
            src={c1Src}
            alt="Cloud"
            className="cloud-drift-ltr-1"
            style={{
              position: 'absolute',
              top: '6%',
              width: '280px',
              opacity: 0.7,
              filter: 'drop-shadow(0 10px 15px rgba(2, 132, 199, 0.15))'
            }}
            onError={(e) => { e.currentTarget.src = '/cloud.png'; }}
          />
          <img
            src={c2Src}
            alt="Cloud"
            className="cloud-drift-rtl-1"
            style={{
              position: 'absolute',
              top: '22%',
              width: '280px',
              opacity: 0.7,
              filter: 'drop-shadow(0 8px 12px rgba(2, 132, 199, 0.12))'
            }}
            onError={(e) => { e.currentTarget.src = '/cloud2.png'; }}
          />
          <img
            src={c1Src}
            alt="Cloud"
            className="cloud-drift-ltr-2"
            style={{
              position: 'absolute',
              top: '52%',
              width: '380px',
              opacity: 0.7,
              filter: 'drop-shadow(0 12px 18px rgba(2, 132, 199, 0.15))'
            }}
            onError={(e) => { e.currentTarget.src = '/cloud.png'; }}
          />
          <img
            src={c2Src}
            alt="Cloud"
            className="cloud-drift-rtl-2"
            style={{
              position: 'absolute',
              top: '72%',
              width: '300px',
              opacity: 0.7,
              filter: 'drop-shadow(0 10px 15px rgba(2, 132, 199, 0.15))'
            }}
            onError={(e) => { e.currentTarget.src = '/cloud2.png'; }}
          />
        </div>
      )}

      {/* PAGE 1: HOME PAGE */}
      {activeTab === 'home' && (
        <>
          {/* "HAPPIEST" Text in Cinzel Decorative font */}
          <h1
            style={{
              position: 'absolute',
              top: '25%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: "'Cinzel Decorative', 'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 'clamp(1rem, 5cqw, 3.5rem)',
              letterSpacing: '4px',
              color: '#000000',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1,
              zIndex: 30,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              userSelect: 'none'
            }}
          >
            HAPPIEST
          </h1>

          {/* Sunflower Left */}
          <img
            src={imgSrc}
            alt="Sunflower Left"
            style={{
              position: 'absolute',
              top: '75%',
              left: '35%',
              transform: 'translate(-50%, -50%)',
              width: '260px',
              maxWidth: '30cqw',
              height: 'auto',
              zIndex: 1,
              opacity: 0.7
            }}
            onError={(e) => {
              e.currentTarget.src = '/sunflower.png';
            }}
          />

          {/* Sunflower Right - Mirrored */}
          <img
            src={imgSrc}
            alt="Sunflower Right"
            style={{
              position: 'absolute',
              top: '75%',
              left: '65%',
              transform: 'translate(-50%, -50%) scaleX(-1)',
              width: '260px',
              maxWidth: '30cqw',
              height: 'auto',
              zIndex: 1,
              opacity: 0.7
            }}
            onError={(e) => {
              e.currentTarget.src = '/sunflower.png';
            }}
          />

          {/* Girl - sits behind the text, above the sunflowers */}
          <img
            src={girlSrc}
            alt="Birthday girl"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              height: '75cqh',
              maxWidth: '70cqw',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'bottom',
              zIndex: 40,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 16px 30px rgba(2, 132, 199, 0.25))'
            }}
            onError={(e) => {
              e.currentTarget.src = '/girl.png';
            }}
          />

          {/* Big Glossy Black Birthday Lettering */}
          <img
            src={letteringSrc}
            alt="Glossy Black Birthday Lettering"
            style={{
              position: 'absolute',
              top: '52%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '1100px',
              maxWidth: '90cqw',
              height: 'auto',
              zIndex: 20,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.25))'
            }}
            onError={(e) => {
              e.currentTarget.src = '/Glossy Black Birthday Lettering.png';
            }}
          />
        </>
      )}

      {/* PAGE 2: GALLERY PAGE (Uses bg2.jpg background with 8 tilted polaroids) */}
      {activeTab === 'gallery' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '90px 20px 40px 20px',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '30px',
              maxWidth: '1050px',
              width: '100%',
              alignItems: 'center',
              paddingBottom: '40px'
            }}
          >
            {galleryPhotos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  background: '#ffffff',
                  padding: '14px 14px 26px 14px',
                  borderRadius: '6px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
                  transform: `rotate(${photo.rotate})`,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  marginTop: photo.top
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08) rotate(0deg)';
                  e.currentTarget.style.zIndex = '20';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.45)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = `rotate(${photo.rotate})`;
                  e.currentTarget.style.zIndex = '1';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.35)';
                }}
              >
                {/* Tape Accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '70px',
                    height: '22px',
                    background: 'rgba(254, 240, 138, 0.85)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    backdropFilter: 'blur(2px)'
                  }}
                />

                {/* Polaroid Photo Frame */}
                <div style={{ height: '210px', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px', background: '#f1f5f9' }}>
                  <img
                    src={photo.src}
                    alt={photo.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = `/gallery/p${photo.id}.jpg`;
                    }}
                  />
                </div>

                <p
                  style={{
                    fontFamily: "'Caveat', cursive, sans-serif",
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#1e293b',
                    textAlign: 'center',
                    lineHeight: 1
                  }}
                >
                  {photo.title}
                </p>

                {/* Randomly placed sticker */}
                <img
                  src={photo.sticker}
                  alt="Decorative sticker"
                  style={{
                    position: 'absolute',
                    width: '75px',
                    height: 'auto',
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
                    zIndex: 20,
                    top: photo.sPos.top,
                    bottom: photo.sPos.bottom,
                    left: photo.sPos.left,
                    right: photo.sPos.right,
                    transform: `rotate(${photo.sPos.rotate})`,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 3: WISHES PAGE (Uses bg3.jpg background with 8 sticker2.png images in a neat grid) */}
      {activeTab === 'wishes' && (
        <div className="wishes-wrapper">
          <div className="wishes-grid">
            {wishStickers.map((s) => (
              <div key={s.id} className="wish-cell">
                <div className="wish-card" style={{ '--rot': s.rotate }}>
                  <img
                    src={sticker2Src}
                    alt="Wish note sticker"
                    className="wish-sticker"
                    onError={(e) => {
                      e.currentTarget.src = '/sticker2.png';
                    }}
                  />
                  <p className="wish-text">{s.wish}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
