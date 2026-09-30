import React from "react";
import bg11 from "./assets/bg1.png";
import bg12 from "./assets/bg2.png";
import bg81 from "./assets/bg8.jpg";
import bg82 from "./assets/bg3.png";
import bg71 from "./assets/bg7.png";
import bg5 from "./assets/bg5.jpg";
import bg4 from "./assets/bg4.jpg";
import cal1 from "./assets/cal.png";
import disc1 from "./assets/disc.png";
import f11 from "./assets/f1.png";
import f31 from "./assets/f3.png";
import f32 from "./assets/f2.png";
import f41 from "./assets/f4.png";
import f51 from "./assets/f5.png";
import hand1 from "./assets/hand.png";
import hand2 from "./assets/hand.png";
import loveLetter1 from "./assets/love_letter.webp";
import rectangle2 from "./assets/card.png";
import songl1 from "./assets/songl.jpg";
import sticker31 from "./assets/sticker3.png";
import sticker51 from "./assets/sticker5.png";
import sticker61 from "./assets/sticker6.png";
import sticker81 from "./assets/sticker8.png";
import sticker91 from "./assets/sticker9.png";
import sticker71 from "./assets/sticker7.png";
import hbd from "./assets/hbd.png";
import printer1 from "./assets/printer.png";
import letterImg1 from "./assets/letter.png";
import envlb1 from "./assets/envlb.png";
import "./style.css";

export const LoveTemplate = (): JSX.Element => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [showPage2, setShowPage2] = React.useState(() => {
        return localStorage.getItem('showPage2') === 'true';
    });

    const handleSetShowPage2 = (value: boolean) => {
        setShowPage2(value);
        localStorage.setItem('showPage2', String(value));
    };
    const [showPopup, setShowPopup] = React.useState(false);
    const [isCardOpen, setIsCardOpen] = React.useState(false);
    const [isPrinted, setIsPrinted] = React.useState(false);
    const audioRef = React.useRef(null) as any;

    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        if (showPopup) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showPopup]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (showPage2) {
        return (
            <div className="container-landscape">
                <img className="bg-8" alt="Bg 8" src={bg81} />
                <img className="bg-4" alt="Bg 4" src={bg4} />
                <img className="hbd-sticker" alt="HBD" src={hbd} />
                <img 
                    className={`printer-img ${!isPrinted ? 'bouncing' : ''}`} 
                    alt="Printer" 
                    src={printer1} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => setIsPrinted(true)}
                />
                <div className="printer-mask">
                    <div className={`printer-output ${isPrinted ? 'printed' : ''}`}>
                        <div className="sticker-7-bg" />
                        <img className="sticker-7" alt="Sticker 7" src={sticker71} />
                    </div>
                </div>
                <img
                    className="letter-img"
                    alt="Letter"
                    src={letterImg1}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPopup(true)}
                />
                <div className="click-me-text" style={{ cursor: 'pointer' }} onClick={() => setShowPopup(true)}>Click me</div>
                
                <div className="flower-cluster">
                    <img className="fc-f5" src={f51} alt="f5" />
                    <img className="fc-f3-1" src={f31} alt="f3" />
                    <img className="fc-f1-1" src={f11} alt="f1" />
                    <img className="fc-f3-2" src={f31} alt="f3" />
                    <img className="fc-f1-2" src={f11} alt="f1" />
                    <img className="fc-f2" src={f32} alt="f2" />
                </div>

                <button className="back-btn" onClick={() => handleSetShowPage2(false)}>BACK</button>

                {showPopup && (
                    <div className="popup-overlay" onClick={() => { setShowPopup(false); setIsCardOpen(false); }}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <div className="popup-close" onClick={(e) => { e.stopPropagation(); setShowPopup(false); setIsCardOpen(false); }}>✖</div>
                            <img className="popup-img" src={bg5} alt="Popup Image" />
                            <div className={`card-container ${isCardOpen ? 'open-card' : ''}`}>
                                <img className="popup-card" src={rectangle2} alt="Card" />
                                <div className="card-text">
                                    <div style={{ width: '100%' }}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '1.2em', textAlign: 'left' }}>My Dear,</p>
                                        <p style={{ margin: '0 0 15px 0', textAlign: 'left', textIndent: '20px', lineHeight: '1.4' }}>
                                            Happy Birthday! Wishing you a fantastic day filled with joy, love, and lots of cake.
                                            May all your dreams come true this year, and may we share many more beautiful moments together.
                                        </p>
                                        <p style={{ margin: 0, textAlign: 'right' }}>With all my love,<br />Yours</p>
                                    </div>
                                </div>
                            </div>
                            <img
                                className={`popup-envlb ${isCardOpen ? 'fade-out' : ''}`}
                                src={envlb1}
                                alt="Envelope"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsCardOpen(true)}
                            />
                            {!isCardOpen && (
                                <div className="click-to-read">click to read</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container">
            <img className="bg" alt="Bg" src={bg81} />
            <img className="img" alt="Bg" src={bg11} />
            <img className="bg-2" alt="Bg" src={bg12} />
            <img
                className="love-letter"
                alt="Love letter"
                src={loveLetter1}
                onClick={() => handleSetShowPage2(true)}
                style={{ cursor: 'pointer' }}
            />
            <div className="happy-birthday">Happy<br />Birthday</div>
            <img className="hand" alt="Hand" src={hand1} />
            <img className="hand-2" alt="Hand" src={hand2} />
            <div className="scroll-down">SCROLL DOWN</div>
            <img className="sticker" alt="Sticker" src={sticker31} />
            <img className="sticker-9" alt="Sticker 9" src={sticker91} />
            <img className="f" alt="F" src={f31} />
            <div className="rectangle" />
            <img className="f-1" alt="F" src={f31} />
            <img className="f-2" alt="F" src={f32} />
            <img
                className={`disc ${isPlaying ? 'fast-spin' : ''}`}
                alt="Disc"
                src={disc1}
                onClick={togglePlay}
                style={{ cursor: 'pointer' }}
            />
            <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop />
            <div className="group">
                <img className="songl" alt="Songl" src={songl1} />
            </div>
            <img className="sticker-2" alt="Sticker" src={sticker61} />
            <img className="bg-3" alt="Bg" src={bg82} />
            <img className="sticker-3" alt="Sticker" src={sticker51} />
            <img className="rectangle-2" alt="Rectangle" src={rectangle2} />
            <img className="cal" alt="Cal" src={cal1} />
            <img className="f-4" alt="F" src={f41} />
            <img className="f-5" alt="F" src={f51} />
            <img className="sticker-4" alt="Sticker" src={sticker81} />
            <div className="mobile-bottom">
                <img className="bg-7" alt="Bg 7" src={bg71} />
                {!isMobile && (
                    <div className="white-box">
                        GO FIRST AND CLICK THE ENVELOP
                    </div>
                )}
            </div>
        </div>
    );
};
