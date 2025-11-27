import { useState } from 'react';

interface CardData {
  gif: string;
  content: string;
}

interface HoverCardProps {
  c: CardData;
  delay: number;
}

function HoverCard({ c, delay }: HoverCardProps) {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full h-full flex flex-col justify-between items-start 
                 border-black border-2 rounded-xl p-5 
                 animate-fadeInUp opacity-0 hover:bg-black 
                 hover:border-white hover:text-white 
                 group transition-all duration-75 ease-linear"
    >
      <img
        key={hover ? "playing" : "stopped"}
        src={c.gif}
        className="w-10 h-10 transition-colors duration-100 ease-linear group-hover:invert"
        alt={c.content}
      />

      <span className="text-2xl font-inter">{c.content}</span>
    </div>
  );
}

export default HoverCard;
