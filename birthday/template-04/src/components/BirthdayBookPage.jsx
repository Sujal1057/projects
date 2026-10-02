import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ScaledSection from './ScaledSection';

import bookImg from '../../assets/book.png';
import polaroid3Img from '../../assets/polaroid3.png';
import polaroid1Img from '../../assets/polaroid1.png';
import polaroid2Img from '../../assets/polaroid2.jpg';
import stripImg from '../../assets/strip.png';
import stickerImg from '../../assets/sticker.png';
import sticker7Img from '../../assets/sticker7.png';
import sticker6Img from '../../assets/sticker6.png';
import postCardImg from '../../assets/post_card.png';
import sticker5Img from '../../assets/sticker5.png';
import sticker3Img from '../../assets/sticker3.png';

export default function BirthdayBookPage() {
  const navigate = useNavigate();
  const section2Ref = useRef(null);
  const section4Ref = useRef(null);

  const [section2Visible, setSection2Visible] = useState(false);
  const [section4Visible, setSection4Visible] = useState(false);

  useEffect(() => {
    document.body.classList.add('page2-body');
    document.body.classList.remove('index-body');
    window.scrollTo(0, 0);

    return () => {
      document.body.classList.remove('page2-body');
    };
  }, []);

  useEffect(() => {
    // Observer for section 2 with lower threshold (0.1) for reliable mobile trigger
    const observer2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSection2Visible(true);
            observer2.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (section2Ref.current) {
      observer2.observe(section2Ref.current);
    }

    // Observer for section 4 with lower threshold (0.1)
    const observer4 = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSection4Visible(true);
            observer4.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (section4Ref.current) {
      observer4.observe(section4Ref.current);
    }

    return () => {
      observer2.disconnect();
      observer4.disconnect();
    };
  }, []);

  return (
    <div className="page2-wrapper">
      {/* Section 1: Book Section */}
      <ScaledSection baseWidth={1280} baseHeight={800} style={{ zIndex: 1 }}>
        <div className="page2-content">
          {/* Back Button */}
          <button
            className="back-btn"
            onClick={() => navigate('/')}
            title="Back to Envelope"
          >
            &times;
          </button>

          <div className="book-container">
            <img src={bookImg} alt="Book" className="book-bg" />

            <div className="book-left">
              <img src={polaroid3Img} alt="Polaroid" className="polaroid-img" />
            </div>

            <div className="book-right">
              <h2>Happy Birthday!</h2>
              <p>
                Wishing you the absolute happiest of birthdays! May this special day bring you endless joy, wonderful
                surprises, and beautiful memories that you will cherish forever. You deserve all the love, success,
                and happiness in the world today and always. Have a truly amazing and fantastic year ahead!
              </p>
            </div>
          </div>
        </div>
      </ScaledSection>

      {/* Section 2: Memories Section */}
      <ScaledSection
        baseWidth={1280}
        baseHeight={800}
        overflow="visible"
        style={{ zIndex: 10 }}
      >
        <section className="page2-section-two" ref={section2Ref}>
          {/* Top Half: Image Left, Text Right */}
          <div className={`half-row ${section2Visible ? 'animate-left' : ''}`}>
            <div className="half-img">
              <img src={polaroid1Img} alt="Memory 1" />
            </div>
            <div className="half-text">
              <p>
                You are the kindest, most incredible person I know. Your smile brightens up the room and your
                beautiful energy makes everyone around you so happy. This day is all about celebrating the wonderful
                soul that you are!
              </p>
            </div>
          </div>

          {/* Bottom Half: Text Left, Image Right (Row Reverse) */}
          <div className={`half-row reverse ${section2Visible ? 'animate-right' : ''}`}>
            <div className="half-img">
              <img src={polaroid2Img} alt="Memory 2" />
            </div>
            <div className="half-text">
              <p>
                From the little moments we share to the big milestones, every second with you is a treasure. Keep
                shining like the beautiful star you are. Here's to making many more unforgettable memories together!
              </p>
            </div>
          </div>
        </section>
      </ScaledSection>

      {/* Section 3: Photo Strip Section */}
      <ScaledSection baseWidth={1280} baseHeight={800} style={{ zIndex: 1 }}>
        <section className="page2-section-three">
          <div className="strip-container">
            <div className="strip-rect"></div>
            <img src={stripImg} alt="Strip" className="strip-img" />
            <img src={stickerImg} alt="Sticker" className="strip-sticker" />
            <img src={sticker7Img} alt="Sticker 7" className="strip-sticker-top-right" />
            <img src={sticker6Img} alt="Sticker 6" className="strip-sticker-bottom-right" />
          </div>
        </section>
      </ScaledSection>

      {/* Section 4: Postcard & Polaroid Section */}
      <ScaledSection baseWidth={1280} baseHeight={800} style={{ zIndex: 1 }}>
        <section className="page2-section-four" ref={section4Ref}>
          <div className={`postcard-wrapper ${section4Visible ? 'animate-in' : ''}`}>
            <img src={postCardImg} alt="Post Card" className="postcard-img" />
            <div className="postcard-text">
              My dearest friend,<br /><br />
              Wishing you a birthday as beautiful and wonderful as you are. I hope this year brings you countless
              reasons to smile and memories you'll treasure forever. Thank you for always being there. Happy
              Birthday!<br /><br />
              With love.
            </div>
          </div>
          <div className={`polaroid-wrapper-4th ${section4Visible ? 'animate-in' : ''}`}>
            <div className="polaroid-rect-4th"></div>
            <img src={polaroid3Img} alt="Polaroid 3" className="polaroid-img-4th" />
            <img src={sticker5Img} alt="Sticker 5" className="sticker5-polaroid" />
            <img src={sticker3Img} alt="Sticker 3" className="sticker3-polaroid" />
          </div>
        </section>
      </ScaledSection>
    </div>
  );
}
