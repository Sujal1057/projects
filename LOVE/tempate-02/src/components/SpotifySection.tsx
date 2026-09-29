import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ExternalLink, Music, Heart } from 'lucide-react';
import { PLAYLIST_TRACKS } from '../data/playlist';

export const SpotifySection: React.FC = () => {
  const [activeEmbedId, setActiveEmbedId] = useState<string | null>(null);

  const toggleEmbed = (id: string) => {
    setActiveEmbedId(activeEmbedId === id ? null : id);
  };

  return (
    <section id="playlist-section" className="relative py-24 px-4 bg-transparent overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-love-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-panel border border-love-200/50 text-love-800 text-xs tracking-widest uppercase font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 text-love-500 fill-love-400" />
            Soundtrack of Us
          </span>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-burgundy font-bold tracking-tight">
            Our Playlist ❤️
          </h2>
          <p className="font-serif text-sm sm:text-base text-love-800/80 max-w-md mx-auto mt-3">
            Every song reminds me of a special moment we've shared together.
          </p>
        </motion.div>

        {/* Vertical Stack on Mobile, Grid on Larger Screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLAYLIST_TRACKS.map((track, index) => {
            const isEmbedActive = activeEmbedId === track.id;

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative rounded-2xl glass-card p-4 overflow-hidden border border-white/80 group h-[128px] sm:h-[144px] flex items-center"
              >
                {isEmbedActive ? (
                  <div className="w-full rounded-xl overflow-hidden shadow-inner bg-transparent flex items-center justify-center h-full">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${track.embedId}?utm_source=generator&theme=0`}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={track.title}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 w-full h-full">
                    {/* Album Cover */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-md border border-white/60">
                      <img
                        src={track.albumArt}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                      {/* Play Button Overlay */}
                      <button
                        onClick={() => toggleEmbed(track.id)}
                        className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-gold-400/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 border border-gold-200"
                        title="Listen preview"
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-white text-white" />
                      </button>
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 text-gold-600 text-xs font-semibold uppercase tracking-wider mb-1">
                        <Music className="w-3 h-3" />
                        <span>Track 0{index + 1}</span>
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-love-900 truncate">
                        {track.title}
                      </h3>
                      <p className="font-sans text-sm text-love-700/80 truncate">
                        {track.artist}
                      </p>

                      {/* Controls & Duration */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-love-600/70 font-mono">
                          {track.duration}
                        </span>

                        <a
                          href={track.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700 font-medium transition-colors"
                        >
                          <span>Spotify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
