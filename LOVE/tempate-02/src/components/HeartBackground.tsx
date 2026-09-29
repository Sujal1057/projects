import React from 'react';

export const HeartBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center bg-white">
      {/* Light Pink Layer fading to White at screen edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#FDEBF0_0%,_#FFF7F8_55%,_#FFFFFF_85%,_#FFFFFF_100%)] opacity-95" />

      {/* Heart-Shaped Dark Pink Soft Blurred Center Core */}
      <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-[#E87A90] filter blur-3xl opacity-70"
        >
          <path
            fill="currentColor"
            d="M50,88.35 L42.75,81.73 C16.9,58.28 0,42.88 0,23.75 C0,8.12 12.12,0 27.5,0 C36.12,0 44.38,4.01 50,10.39 C55.62,4.01 63.88,0 72.5,0 C87.88,0 100,8.12 100,23.75 C100,42.88 83.1,58.28 57.25,81.75 L50,88.35 Z"
          />
        </svg>
      </div>

      {/* Subtle Secondary Heart Glow Ring */}
      <div className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-[#DE4778] filter blur-2xl opacity-40"
        >
          <path
            fill="currentColor"
            d="M50,88.35 L42.75,81.73 C16.9,58.28 0,42.88 0,23.75 C0,8.12 12.12,0 27.5,0 C36.12,0 44.38,4.01 50,10.39 C55.62,4.01 63.88,0 72.5,0 C87.88,0 100,8.12 100,23.75 C100,42.88 83.1,58.28 57.25,81.75 L50,88.35 Z"
          />
        </svg>
      </div>
    </div>
  );
};
