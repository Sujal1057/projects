# Implementation Plan — Premium Interactive Romantic Greeting Website

Create an emotional, highly animated, luxury mobile-first interactive love story web application using React, TypeScript, Tailwind CSS, Framer Motion, GSAP, and Lenis.

## User Review Required

> [!IMPORTANT]
> - **Asset Generation**: We will generate high-quality romantic aesthetic images for the 15 Polaroid photos using high-definition AI image generation / curated high quality visuals to ensure no broken or blank placeholders exist.
> - **Audio Option**: Ambient romantic background audio (with mute/unmute control) will be included to enhance the emotional atmosphere.
> - **Customizable Date**: The Love Countdown timer will use a default anniversary date (e.g. 500+ days ago) and allow customizable inputs if desired.

## Open Questions

None at this time. All prompt specifications are clearly detailed.

---

## Proposed Changes

### Project Initialization & Setup

#### [NEW] [package.json](file:///e:/D_kanvaz/LOVE/temp-3/package.json)
- Setup Vite React TypeScript project.
- Dependencies: `react`, `react-dom`, `framer-motion`, `gsap`, `@gsap/react`, `lenis`, `lucide-react`, `canvas-confetti`, `@types/canvas-confetti`.
- DevDependencies: `vite`, `typescript`, `tailwindcss`, `@tailwindcss/vite` (or `postcss` + `autoprefixer`), `@types/react`, `@types/react-dom`.

#### [NEW] [index.html](file:///e:/D_kanvaz/LOVE/temp-3/index.html)
- SEO Meta tags, open graph metadata, title "Our Love Story ❤️".
- Import Google Fonts: `Playfair Display`, `Cormorant Garamond`, `Dancing Script`, `Cinzel`, `Inter`.

#### [NEW] [src/index.css](file:///e:/D_kanvaz/LOVE/temp-3/src/index.css)
- Core design system: luxury soft pink (`#FFF5F6`, `#FDE8E9`), warm cream (`#FFFDF9`), burgundy accent (`#8B263E`), rich gold (`#D4AF37`, `#E5C158`), glassmorphism utilities, custom paper textures, scrollbar styling, keyframes for particle glows & floating hearts.

---

### Core Structure & Components

#### [NEW] [src/types/index.ts](file:///e:/D_kanvaz/LOVE/temp-3/src/types/index.ts)
- Type definitions for memories, Spotify tracks, polaroid data, animation states (`Intro`, `Envelope`, `Rain`, `Letter`, `MainContent`, `Final`).

#### [NEW] [src/data/memories.ts](file:///e:/D_kanvaz/LOVE/temp-3/src/data/memories.ts)
- 15 memory photo items with romantic titles, dates, descriptions, and high quality image URLs.

#### [NEW] [src/data/playlist.ts](file:///e:/D_kanvaz/LOVE/temp-3/src/data/playlist.ts)
- 4 curated romantic track embeds/data (e.g., Taylor Swift, Ed Sheeran, Bruno Mars, Daniel Caesar).

---

### Animation & Audio Helpers

#### [NEW] [src/components/AudioPlayer.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/AudioPlayer.tsx)
- Floating ambient audio player button with soft pulsing wave effect and audio controls.

#### [NEW] [src/components/BackgroundParticles.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/BackgroundParticles.tsx)
- Canvas-based soft glowing floating particles and romantic floating heart bokeh.

---

### Main Experience Sections

#### [NEW] [src/components/IntroSection.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/IntroSection.tsx)
- **Section 1: Intro**
  - Full-screen loading screen with soft gradient background and floating ambient light particles.
  - Text: *"A little piece of my heart is waiting for you..."* with smooth Framer Motion fade-in / fade-out.
  - Auto transition after 2.5s to Envelope.

#### [NEW] [src/components/EnvelopeSection.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/EnvelopeSection.tsx)
- **Section 2: Envelope**
  - Centered realistic paper envelope with wax seal, gold embossed icon, receiver text *"To, My Favourite Person ❤️"*.
  - Subtle breathing idle animation.
  - Entire envelope is clickable.
  - On click GSAP Timeline: Wax seal cracks into golden particles, envelope 3D flap opens, letter slides upwards, seamlessly triggers Polaroid Rain.

#### [NEW] [src/components/PolaroidRain.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/PolaroidRain.tsx)
- **Section 3: Polaroid Rain**
  - Exactly 15 polaroid photo frames dropping from random top X coordinates with random rotations (-25° to +25°), physics drop speeds, bounce & settle dynamics at bottom container, natural shadows.
  - Lasts ~6 seconds. User scrolling locked.
  - Fades away polaroids smoothly once settled to transition into Love Letter.

#### [NEW] [src/components/LoveLetterSection.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/LoveLetterSection.tsx)
- **Section 4: Love Letter**
  - Realistic unfolded paper letter with paper texture, deckled edges, and floating hover animation.
  - GSAP unfolding paper effect.
  - Typewriter animation for letter body:
    > Dear Love,
    > 
    > From the day you entered my life,
    > everything became brighter.
    > 
    > Thank you for every smile,
    > every laugh,
    > every memory.
    > 
    > No matter what happens,
    > I'll always choose you.
    > 
    > Forever yours ❤️
  - Unlocks scroll progression after completion.

#### [NEW] [src/components/SpotifySection.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/SpotifySection.tsx)
- **Section 5: Spotify Playlist**
  - Heading *"Our Playlist ❤️"*.
  - 4 glassmorphic rounded cards with Spotify aesthetic, song details, album art, play status, hover lift & soft glow.
  - Responsive vertical stack on mobile.

#### [NEW] [src/components/LoveCountdown.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/LoveCountdown.tsx)
- **Section 6: Love Countdown**
  - Heading *"We've Been Together"*.
  - Live updating Days, Hours, Minutes, Seconds counters with smooth flip/number change animations.
  - Floating tiny hearts canvas/CSS background.

#### [NEW] [src/components/MemoryBooth.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/MemoryBooth.tsx)
- **Section 7: Memory Booth**
  - Vintage film-strip / photo gallery displaying 15 polaroids.
  - Individual captions (First Meet ❤️, Our First Selfie, Coffee Date ☕, Movie Night 🍿, etc.).
  - Hover tilt & lift.
  - Tap opens full-screen interactive Lightbox with touch swipe, prev/next navigation, smooth scale animations.
  - Quote: *"Every picture tells a story... My favorite story is us."*

#### [NEW] [src/components/FinalSection.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/components/FinalSection.tsx)
- **Section 8: Final Ending**
  - Fullscreen romantic finish with blurred romantic background.
  - Text: *"No matter where life takes us... I'll always choose you. ❤️"*
  - *"Replay Story"* button with glowing hover & click interaction to reset the experience back to Section 1.

#### [NEW] [src/App.tsx](file:///e:/D_kanvaz/LOVE/temp-3/src/App.tsx)
- Integration of Lenis smooth scroll, story state controller, audio controller, ambient particles, and section sequence flow.

---

## Verification Plan

### Automated Tests & Linting
- Run `npm run build` / TypeScript typecheck (`npx tsc --noEmit`) to verify zero type errors or broken imports.
- Run `npm run dev` and test browser execution.

### Manual Verification
- Test intro loading fade sequence (2.5s timer).
- Test envelope click: verify seal crack, flap opening, letter slide, and trigger of Polaroid Rain.
- Verify exactly 15 falling polaroids with randomized rotation (-25° to +25°), bounce, and smooth fade-out.
- Verify typewriter effect on love letter.
- Verify smooth Lenis scrolling to Spotify, Countdown, Memory Booth, and Final section.
- Test lightbox modal with swipe/arrow controls on 15 memories.
- Test "Replay Story" button to ensure clean reset to Section 1.
- Test responsiveness across mobile, tablet, and desktop views.
