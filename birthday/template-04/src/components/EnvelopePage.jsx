import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScaledSection from './ScaledSection';
import envlb2 from '../../assets/envlb2.png';
import f1 from '../../assets/f1.png';
import sticker5 from '../../assets/sticker5.png';

export default function EnvelopePage({ onStartAudio }) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    document.body.classList.add('index-body');
    document.body.classList.remove('page2-body');

    if (sessionStorage.getItem('bg_music_playing') === 'true') {
      setShowPopup(false);
      setIsStarted(true);
    }

    return () => {
      document.body.classList.remove('index-body');
    };
  }, []);

  const handleStart = () => {
    setShowPopup(false);
    setIsStarted(true);
    if (onStartAudio) {
      onStartAudio();
    }
  };

  const handleEnvelopeClick = () => {
    navigate('/page2');
  };

  return (
    <>
      <ScaledSection baseWidth={1280} baseHeight={800}>
        <section className={`section-one ${isStarted ? 'start-animation' : ''}`}>
          <div className="envelope-container" onClick={handleEnvelopeClick}>
            <div className="letter">
              <h2>Happy Birthday!</h2>
              <p>Wishing you a wonderful day!</p>
            </div>
            <img src={envlb2} alt="Envelope" className="envelope-img" />
            <img src={f1} alt="f1 decor" className="f1-img" />
            <img src={sticker5} alt="Sticker 5" className="f5-img" />
          </div>

          <div className="click-text">
            <p>Click the Envelope!</p>
          </div>
        </section>
      </ScaledSection>

      {/* Surprise Popup */}
      {showPopup && (
        <div id="surprise-popup" className="blue-popup-overlay">
          <div className="blue-popup-card">
            <h2 className="blue-popup-title">Are you ready for the surprise?</h2>
            <button
              id="surprise-start-btn"
              className="blue-start-btn"
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      )}
    </>
  );
}
