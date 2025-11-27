'use client';

import { useEffect, useState } from "react";

type ModeAction = 
  | { type: 'SELECT_STORY' }
  | { type: 'SELECT_DIALOGUE' }
  | { type: 'SELECT_RANDOM' };

type Mode = 'none' | 'story' | 'dialogue' | 'random';

interface ModesProps {
  onModeSelect: (action: ModeAction) => void;
  currentMode: Mode;
}

export default function Modes({ onModeSelect, currentMode }: ModesProps) {
  const [active, setActive] = useState<boolean[]>(Array(11).fill(false));
  const [activeTwo, setActiveTwo] = useState<boolean[]>(Array(11).fill(false));
  const [activeThree, setActiveThree] = useState<boolean[]>(Array(11).fill(false));
  const gifs = Array.from({ length: 10 });

  useEffect(() => {
    // Preload all GIFs to prevent layout shift
    const preloadImages = [
      ...Array.from({ length: 11 }, (_, i) => `/bookmark2.gif?i=${i}`),
      ...Array.from({ length: 11 }, (_, i) => `/speech.gif?i=${i}`),
      ...Array.from({ length: 11 }, (_, i) => `/puzzled.gif?i=${i}`)
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    gifs.forEach((_, i) => {
      setTimeout(() => {
        setActive(prev => {
          const copy = [...prev];
          copy[i] = true;
          return copy;
        });
        setActiveTwo(prev => {
          const copy = [...prev];
          copy[i] = true;
          return copy;
        });
        setActiveThree(prev => {
          const copy = [...prev];
          copy[i] = true;
          return copy;
        });
      }, i * 1000);
    });
  }, []);

  return (
    <div className="flex flex-col gap-5 w-fit h-screen">
      <button
        onClick={() => onModeSelect({ type: 'SELECT_STORY' })}
        className={`cursor-pointer group/master flex-1 flex flex-col rounded-xl border-2 items-center hover:bg-black hover:text-white justify-center gap-5 ${currentMode === 'story' ? 'bg-black text-white border-white' : 'border-black'}`}>
        
        {/* SCROLLING GIF STRIP */}
        <div className="relative w-fit h-12 overflow-hidden">
          <div className="flex gap-5 animate-scroll-x w-[200%]">
            {gifs.map((_, i) => (
              <img
                key={i}
                src={active[i] ? `/bookmark2.gif?i=${i}` : `/bookmark2.svg`}
                className={`w-10 h-10 group-hover/master:invert ${currentMode === 'story' ? 'invert' : ''}`}
                width="40"
                height="40"
                alt="bookmark"
              />
            ))}
          </div>
        </div>

        <span className="font-inter font-extrabold text-3xl">Story Mode</span>
      </button>

      <button
        onClick={() => onModeSelect({ type: 'SELECT_DIALOGUE' })}
        className={`cursor-pointer group/masterTwo flex-1 flex flex-col rounded-xl border-2 items-center hover:bg-black hover:text-white justify-center gap-5 ${currentMode === 'dialogue' ? 'bg-black text-white border-white' : 'border-black'}`}>
        
        {/* SCROLLING GIF STRIP */}
        <div className="relative w-full h-12 overflow-hidden">
          <div className="flex gap-5 animate-scroll-x w-[200%]">
            {gifs.map((_, i) => (
              <img
                key={i}
                src={activeTwo[i] ? `/speech.gif?i=${i}` : `/speech.svg`}
                className={`w-10 h-10 group-hover/masterTwo:invert ${currentMode === 'dialogue' ? 'invert' : ''}`}
                width="40"
                height="40"
                alt="speech"
              />
            ))}
          </div>
        </div>
        
        <span className="font-inter font-extrabold text-3xl">Dialogue Mode</span>
      </button>

      <button
        onClick={() => onModeSelect({ type: 'SELECT_RANDOM' })}
        className={`cursor-pointer group/masterThree flex-1 flex flex-col rounded-xl border-2 items-center hover:bg-black hover:text-white justify-center gap-5 ${currentMode === 'random' ? 'bg-black text-white border-white' : 'border-black'}`}>
        
        {/* SCROLLING GIF STRIP */}
        <div className="relative w-full h-12 overflow-hidden">
          <div className="flex gap-5 animate-scroll-x w-[200%]">
            {gifs.map((_, i) => (
              <img
                key={i}
                src={`/puzzled.gif?i=${i}`}
                className={`w-10 h-10 group-hover/masterThree:invert ${currentMode === 'random' ? 'invert' : ''}`}
                width="40"
                height="40"
                alt="puzzled"
              />
            ))}
          </div>
        </div>
        
        <span className="font-inter font-extrabold text-3xl">Random Mode</span>
      </button>
    </div>
  )
}
