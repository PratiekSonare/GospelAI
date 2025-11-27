'use client';

import Main from "@/components/Main";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";

export default function Home() {

  const [scroll, setScroll] = useState(0);
  const mainContentRef = useRef(null);

  useEffect(() => {
    const div = mainContentRef.current;

    const handleScroll = () => {
      if (div.scrollTop > 2) {
        // alert(`heres the`)
        setScroll(true)
      } else {
        setScroll(false);
      }
    };

    div.addEventListener("scroll", handleScroll);

    return () => div.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="menu-list"
      className="relative flex flex-col justify-center items-center h-screen w-screen bg-white font-serif">

      <div 
        className={`w-1/5 rounded-b-3xl z-500 absolute top-0 left-[calc(100vw - 1/2)] ${scroll ? "bg-black" : "bg-transparent"} transition-colors duration-300 ease-linear`}>
        <img src='/logo.svg' alt="gospel_ai" className={`w-fit h-fit rounded-b-2xl ${scroll ? "invert":""} px-10 py-5 scale-90`} draggable="false"></img>
      </div>

      <div
        ref={mainContentRef}
        id="menu-list"
        className="flex-1 w-full overflow-x-hidden flex justify-center items-start"
      >
        <Main />
      </div>

      <Footer />
    </div>
  );
}
