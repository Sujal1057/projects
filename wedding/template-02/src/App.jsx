import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import DomeGallery from './DomeGallery';



function App() {
  const coupleNamesRef = useRef(null);
  const imageContainerRef = useRef(null);
  const bg1Ref = useRef(null);
  const coupleRef = useRef(null);
  const heroForegroundRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;

          if (bg1Ref.current) {
            const scaleVal = Math.max(1, 1.1 - scrollPosition * 0.0002);
            const maxTranslate = window.innerHeight * 0.15;
            const translateVal = Math.min(scrollPosition * 0.1, maxTranslate);
            bg1Ref.current.style.transform = `translate3d(0, -${translateVal}px, 0) scale(${scaleVal})`;
          }

          if (coupleRef.current) {
            const rect = coupleRef.current.getBoundingClientRect();
            // Start animating exactly when the couple photo enters the bottom of the screen (rect.top = window.innerHeight)
            // End animating when it reaches the middle of the screen (rect.top = window.innerHeight * 0.5)
            let coupleProgress = (window.innerHeight - rect.top) / (window.innerHeight * 0.5);
            coupleProgress = Math.max(0, Math.min(1, coupleProgress));

            const coupleY = 250 * (1 - coupleProgress);
            const coupleScale = 1 + 0.5 * (1 - coupleProgress);

            coupleRef.current.style.transform = `translateX(-50%) translate3d(0, ${coupleY}px, 0) scale(${coupleScale})`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Stop observing so it only animates the first time
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });

    revealElements.forEach(el => scrollObserver.observe(el));

    return () => {
      scrollObserver.disconnect();
    };
  }, []);

  return (
    <div className="image-container" ref={imageContainerRef}>
      <img src="assets/bg-1.png" alt="Top Photo" className="bg-1" ref={bg1Ref} />

      <div className="couple-names">
        <div className="name">Oliver</div>
        <div className="weds">weds</div>
        <div className="name">Amelia</div>
      </div>

      <div className="scroll-indicator">
        SCROLL
        <div className="line"></div>
      </div>

      <div style={{ height: isMobile ? '75vh' : '70vh', width: '100%' }}></div>
      <div className="hero-wrapper" style={{ position: 'relative', width: '100%' }}>
        <img src="assets/hero.png" alt="Foreground" className="hero-foreground" />
        <img ref={coupleRef} src="assets/couple.png" alt="Couple" className="couple-photo" />
        <div className="seam-blur"></div>
      </div>
      <div className="bg-2-wrapper">
        <img src="assets/bg-2.png" alt="Bottom Photo" className="bg-2" />
        <div className="invitation-overlay">
          <div className="invitation-content">
            <img src="assets/bappa.png" alt="Lord Ganesha" className="reveal-on-scroll bappa-img" />

            <p className="reveal-on-scroll inv-small">With the heavenly blessings of</p>
            <h3 className="reveal-on-scroll inv-names">Smt. Lata Devi & Sm. Kamal Kapoor</h3>

            <div className="reveal-on-scroll inv-divider"></div>

            <h3 className="reveal-on-scroll inv-names">Mrs. Reena & Mr. Rajiv Kapoor</h3>

            <p className="reveal-on-scroll inv-invite">INVITE</p>
            <p className="reveal-on-scroll inv-small">You to join us in the wedding celebrations of</p>

            <h1 className="reveal-on-scroll inv-couple">Abhishek</h1>
            <p className="reveal-on-scroll inv-amp">&</p>
            <h1 className="reveal-on-scroll inv-couple">Kanika</h1>

            <p className="reveal-on-scroll inv-small">Daughter of</p>
            <h3 className="reveal-on-scroll inv-names">Mrs. Shalini & Mr. Aakash Mittal,</h3>

            <p className="reveal-on-scroll inv-small">On the following events</p>
          </div>
        </div>
      </div>

      <div className="bg-3-wrapper">
        <img src="assets/bg-3.jpg" alt="Third Photo" className="bg-3" />

        <div className="meet-couple-overlay">
          <div className="meet-couple-container">
            <h2 className="reveal-on-scroll section-title">Meet the Couple</h2>
            <div className="reveal-on-scroll flower-icon">❀</div>

            <div className="reveal-on-scroll main-couple-photo-container" style={{
              margin: '0 auto 50px',
              position: 'relative',
              width: '320px',
              height: 'auto',
              minHeight: '420px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img src="assets/frame.png" alt="Frame" style={{
                position: 'relative',
                width: '100%',
                height: 'auto',
                zIndex: 2,
                pointerEvents: 'none'
              }} />

              {/* This inner div represents where the real photo will go */}
              <div className="photo-inner-placeholder" style={{
                position: 'absolute',
                top: '15%', left: '15%', width: '70%', height: '70%',
                background: 'rgba(255,255,255,0.6)',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '10px'
              }}>
                <span style={{ color: '#000', fontWeight: 'bold' }}>Couple Photo</span>
              </div>
            </div>

            <div className="couple-text-columns">
              {/* Bride Text */}
              <div className="reveal-on-scroll couple-text-block">
                <h4 className="title-text">The Bride</h4>
                <h3 className="name-text">Roopa</h3>
                <p className="desc-text">
                  "Roopa is the creative and adventurous one, always ready for a new experience and currently pursuing her master's in the USA."
                </p>
              </div>

              {/* Groom Text */}
              <div className="reveal-on-scroll couple-text-block">
                <h4 className="title-text">The Groom</h4>
                <h3 className="name-text">Anoop</h3>
                <p className="desc-text">
                  "Anoop is a software engineer, travel enthusiast, and the responsible planner of the duo — always armed with a plan, a backup plan, and a spreadsheet to track both!"
                </p>
              </div>
            </div>

            {/* Joint Description Quote */}
            <div className="reveal-on-scroll joint-quote-frame">
              <p>
                She's all about spontaneity, he's all about strategy. She follows her heart, he trusts his mind. Between her "Let's do it!" and his "Let's plan it!", they found their perfect match.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-4-wrapper" id="events-section">
        <img src="assets/bg-4.png" alt="Fourth Photo" className="bg-4" />

        <div className="events-overlay">
          <div className="events-container">
            <h2 className="reveal-on-scroll section-title">Wedding Events</h2>
            <div className="reveal-on-scroll flower-icon">❀</div>

            <div className="events-grid">
              {/* Event 1 */}
              <div className="reveal-on-scroll event-card">
                <div className="event-photo-container">
                  <img src="assets/frame-2.png" alt="Frame" className="event-frame-img" />
                  <div className="event-photo-placeholder"><span>Photo</span></div>
                </div>
                <h3 className="event-title">Haldi</h3>
                <p className="event-time">Oct 10 • 10:00 AM</p>
              </div>

              {/* Event 2 */}
              <div className="reveal-on-scroll event-card">
                <div className="event-photo-container">
                  <img src="assets/frame-2.png" alt="Frame" className="event-frame-img" />
                  <div className="event-photo-placeholder"><span>Photo</span></div>
                </div>
                <h3 className="event-title">Mehendi</h3>
                <p className="event-time">Oct 10 • 4:00 PM</p>
              </div>

              {/* Event 3 */}
              <div className="reveal-on-scroll event-card">
                <div className="event-photo-container">
                  <img src="assets/frame-2.png" alt="Frame" className="event-frame-img" />
                  <div className="event-photo-placeholder"><span>Photo</span></div>
                </div>
                <h3 className="event-title">Sangeet</h3>
                <p className="event-time">Oct 10 • 7:30 PM</p>
              </div>

              {/* Event 4 */}
              <div className="reveal-on-scroll event-card">
                <div className="event-photo-container">
                  <img src="assets/frame-2.png" alt="Frame" className="event-frame-img" />
                  <div className="event-photo-placeholder"><span>Photo</span></div>
                </div>
                <h3 className="event-title">Baraat</h3>
                <p className="event-time">Oct 11 • 5:00 PM</p>
              </div>

              {/* Event 5 */}
              <div className="reveal-on-scroll event-card">
                <div className="event-photo-container">
                  <img src="assets/frame-2.png" alt="Frame" className="event-frame-img" />
                  <div className="event-photo-placeholder"><span>Photo</span></div>
                </div>
                <h3 className="event-title">Wedding</h3>
                <p className="event-time">Oct 11 • 7:00 PM</p>
              </div>

              {/* Event 6 */}
              <div className="reveal-on-scroll event-card">
                <div className="event-photo-container">
                  <img src="assets/frame-2.png" alt="Frame" className="event-frame-img" />
                  <div className="event-photo-placeholder"><span>Photo</span></div>
                </div>
                <h3 className="event-title">Reception</h3>
                <p className="event-time">Oct 12 • 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <img src="assets/center.png" alt="Transition Divider" className="center-transition" />

      <div className="bg-5-wrapper">
        <img src="assets/bg-5.png" alt="Fifth Photo" className="bg-5" />
        <div className="dome-container" style={{ position: 'relative', zIndex: 40, width: '100%', height: '100vh', overflow: 'hidden' }}>
          <DomeGallery />
        </div>
      </div>

      <img src="assets/center.png" alt="Transition Divider" className="center-transition" />

      <div className="bg-6-wrapper">
        <img src="assets/bg-6.png" alt="Sixth Photo" className="bg-6" />
        <div className="venue-elegant-overlay">
          <div className="venue-elegant-content">
            <h2 className="venue-elegant-title reveal-on-scroll">Venue & Stay</h2>
            
            <div className="venue-elegant-divider reveal-on-scroll"></div>
            
            <h3 className="venue-elegant-name reveal-on-scroll">Taj Lake Palace</h3>
            
            <p className="venue-elegant-address reveal-on-scroll">
              Pichola, Udaipur<br />
              Rajasthan 313001, India
            </p>
            
            <p className="venue-elegant-note reveal-on-scroll">
              We have arranged accommodations for all our guests at the palace.<br />
              Please RSVP to confirm your attendance and stay.
            </p>

            <div className="venue-elegant-actions reveal-on-scroll">
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="elegant-btn outline-btn">
                Directions
              </a>
              <button className="elegant-btn solid-btn" onClick={() => alert('RSVP Form coming soon!')}>
                RSVP Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
