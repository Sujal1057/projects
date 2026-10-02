import React, { useEffect, useRef } from 'react';
import musicSrc from '../../assets/music.mp3';

export default function BackgroundAudio({ isPlaying, setIsPlaying }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      sessionStorage.setItem('bg_music_time', audio.currentTime.toString());
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);

    // Check session storage on mount
    const savedPlaying = sessionStorage.getItem('bg_music_playing') === 'true';
    const savedPaused = sessionStorage.getItem('bg_music_paused') === 'true';
    const savedTime = parseFloat(sessionStorage.getItem('bg_music_time') || '0');

    if (savedPlaying && !savedPaused) {
      setIsPlaying(true);
      audio.currentTime = savedTime;
      audio.play().catch((err) => console.log('Audio autoplay prevented:', err));
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      sessionStorage.setItem('bg_music_playing', 'true');
      sessionStorage.setItem('bg_music_paused', 'false');
      const savedTime = parseFloat(sessionStorage.getItem('bg_music_time') || '0');
      if (audio.paused) {
        audio.currentTime = savedTime;
        audio.play().catch((err) => console.log('Audio play error:', err));
      }
    }
  }, [isPlaying]);

  return (
    <audio
      id="bg-music"
      ref={audioRef}
      src={musicSrc}
      loop
      preload="auto"
    />
  );
}
