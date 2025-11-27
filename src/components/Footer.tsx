'use client';

import { useState } from "react";

interface Social {
  src: string;
  alt: string;
  href: string;
  class: string;
  email?: boolean;
}

export default function Footer() {
  const [hover, setHover] = useState<boolean>(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  const socials: Social[] = [
    {
      src: "/linkedin.svg",
      alt: "my career :3",
      href: "https://www.linkedin.com/in/pratiek-sonare/",
      class: "w-6 invert",
    },
    {
      src: "/github.svg",
      alt: "repos <3",
      href: "https://github.com/PratiekSonare",
      class: "w-6 invert"
    },
    {
      src: "/instagram.svg",
      alt: "social_life == 0",
      href: "https://www.instagram.com/pratiek_1604",
      class: "w-6 invert"
    },
    {
      src: "/iitb.svg",
      alt: "IIT",
      href: "22b2440@iitb.ac.in",
      class: `w-7 cursor-pointer`,
      email: true
    }
  ]
  
  return (
    <div className="w-full h-20 shrink-0 text-white bg-black text-lg flex flex-row justify-between items-center px-5 font-mono">
      <div className="flex flex-row gap-4 justify-center">
        {socials.map((s, i) => (
          <div 
            key={i}
            onMouseEnter={() => s.email && setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseMove={(e) => s.email && handleMove(e)}
          >
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              <img src={s.src} className={s.class} alt={s.alt}></img>
            </a>
            {hover && (
              <div 
                style={{
                  top: pos.y - 30,
                  left: pos.x + 15,
                }}
                className="fixed bg-white py-1 px-3 text-black pointer-events-none">
                22b2440@iitb.ac.in
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-center items-end">
        <span className="text-xs text-gray-300">By</span>
        <span className="font-mono">Pratiek Sonare</span>
      </div>
    </div>
  )
}
