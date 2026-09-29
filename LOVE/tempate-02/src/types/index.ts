export type StoryState = 
  | 'intro'        // Section 1: Intro loading screen
  | 'envelope'     // Section 2: Interactive Envelope with wax seal
  | 'rain'         // Section 3: Polaroid Rain sequence (~6s)
  | 'letter'       // Section 4: Typewriter Love Letter
  | 'scrolling'    // Sections 5-7 unlocked for scrolling (Spotify, Countdown, Memory Booth)
  | 'final';       // Section 8: Final ending screen

export interface MemoryItem {
  id: number;
  title: string;
  caption: string;
  date: string;
  imageUrl: string;
  location?: string;
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
  spotifyUrl: string;
  embedId: string;
}

export interface PolaroidRainPhoto {
  id: number;
  imageUrl: string;
  caption: string;
  xRatio: number; // 0 to 1 position across screen width
  rotation: number; // -25 to +25 deg
  speed: number;
  delay: number;
}
