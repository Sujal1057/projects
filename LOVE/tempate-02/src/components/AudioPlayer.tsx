import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Royalty-free acoustic ambient romantic track
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Audio playback prevented:', err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed top-5 right-5 z-50 flex items-center gap-2"
    >
      <button
        onClick={togglePlay}
        className={`flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-love-200/50 shadow-glass text-love-900 text-xs tracking-wider uppercase font-medium hover:border-gold-400 transition-all duration-300 ${isPlaying ? 'ring-2 ring-love-300 ring-offset-1 ring-offset-cream-50' : ''}`}
        title={isPlaying ? "Pause Music" : "Play Romantic Music"}
      >
        <Music className={`w-3.5 h-3.5 text-love-600 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        <span className="hidden sm:inline font-serif italic text-sm text-love-800">
          {isPlaying ? "Playing Melody..." : "Romantic Sound"}
        </span>
        
        {isPlaying && (
          <span className="flex items-end gap-0.5 h-3 ml-1">
            <span className="w-0.5 h-3 bg-love-500 rounded-full animate-pulse"></span>
            <span className="w-0.5 h-2 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-0.5 h-3.5 bg-love-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </span>
        )}
      </button>

      {isPlaying && (
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full glass-panel border border-love-200/50 text-love-800 hover:text-love-600 transition-all shadow-glass"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-love-600" />}
        </button>
      )}
    </motion.div>
  );
};
