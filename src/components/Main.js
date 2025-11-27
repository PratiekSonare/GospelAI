'use client';

import { useEffect, useRef, useState } from "react";
import { useMachine } from '@xstate/react';
import TextEditor from "./TextEditor";
import Modes from "./Modes";
import flow from "../app/animation/flow";
import { modeMachine } from "../lib/modeMachine";

export default function Main() {

    const [state, send] = useMachine(modeMachine);
    
    const [vis, setVis] = useState(false);
    const [visButton, setVisButton] = useState(false);
    const [moveTitle, setMoveTitle] = useState(false);
    const [moveCards, setMoveCards] = useState(false);
    const [hovers, setHovers] = useState([false, false, false, false]);

    const textEditorRef = useRef(null);

    const cards = [
        {
            image: '/bookmark.svg',
            gif: '/bookmark.gif',
            content: "Give us 20-30 characters.",
            sContent: "We'll complete your story or dialogue."
        },
        {
            image: '/pencil.svg',
            gif: '/pencil.gif',
            content: "Choose the mood.",
            sContent: "Provide context behind the scenario."
        },
        {
            image: '/tick.svg',
            gif: '/tick.gif',
            content: "Stories in one-click.",
            sContent: "Just press on \"Continue Writing\"."
        },
        {
            image: '/settings.svg',
            gif: '/settings.gif',
            content: "Easy Proof-reading.",
            sContent: "Edit, track & tune stories with ease."
        },
    ]

    useEffect(() => {
        setTimeout(() => {
            flow({
                selector: "#flow-text",
                char: "w",
                interval: 100,
                limit: 4,
                loop: false
            });
        }, 500);

        setTimeout(() => {
            setVis(true);
        }, 1500);

        setTimeout(() => {
            setVisButton(true);
        }, 2500);

        setTimeout(() => {
            setMoveTitle(true);
        }, 3500);

        setTimeout(() => {
            setMoveCards(true);
        }, 4000);
    }, []);

    return (
        <div id="menu-list" className="relative min-h-screen w-full text-black text-lg overflow-x-hidden overflow-y-auto">


            <div className={`p-2 ${moveTitle ? "-translate-y-52" : ""} transition-transform duration-1000 ease-in-out`}>
                <div className={`relative h-screen flex flex-col items-center`}>

                    {/* Title + subtitle + button */}
                    <div className="flex flex-col grow items-center justify-center">
                        <div className="flex flex-col gap-4 items-center justify-center">
                            <span id="flow-text" className="unselectable font-calsans text-8xl">Let your imagination flow</span>
                            <span className={`font-calsans text-6xl unselectable text-gray-500 ${vis ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-linear`}>
                                with the power of AI
                            </span>
                        </div>

                        <div className="my-5"></div>

                        <div className="w-full flex items-center justify-center">
                            <button
                                onClick={() => textEditorRef.current.scrollIntoView({ behavior: "smooth", block: "start" })}
                                className={`cursor-pointer scale-100 active:scale-90 items-center w-fit rounded-lg mx-auto font-inter px-3 py-1 text-lg border border-black bg-transparent hover:bg-black text-black hover:text-white transition-colors duration-300 ${visButton ? "opacity-100" : "opacity-0"} transition-opacity ease-linear duration-300 ease-linear`}
                            >
                                <span>GET STARTED</span>
                            </button>
                        </div>
                    </div>

                    {moveCards && (
                        <div
                            className="absolute bottom-0 translate-x-0 opacity-100 justify-end items-start w-full h-1/4 flex flex-row gap-10 px-32 transition-transform duration-500 ease-in-out"
                        >
                            {cards.map((c, i) => (
                                <div
                                    key={i}
                                    onMouseEnter={() =>
                                        setHovers(prev => {
                                            const copy = [...prev];
                                            copy[i] = true;
                                            return copy;
                                        })
                                    }
                                    onMouseLeave={() =>
                                        setHovers(prev => {
                                            const copy = [...prev];
                                            copy[i] = false;
                                            return copy;
                                        })
                                    }
                                    style={{ animationDelay: `${i * 0.3}s` }}
                                    className="cursor-pointer w-full h-full flex flex-col justify-between items-start border-black border-2 rounded-xl p-5 animate-fadeInUp opacity-0 hover:bg-black hover:border-white hover:text-white group transition-all duration-75 ease-linear"
                                >
                                    {!hovers[i] ? (
                                        <img
                                            src={c.image}
                                            className="w-10 h-10"
                                        />
                                    ) : (
                                        <img
                                            src={c.gif}
                                            className="w-10 h-10 invert transition-colors duration-100 ease-linear"
                                        />)}

                                    <div className="flex flex-col gap-1">
                                        <span className="text-2xl font-inter font-extrabold">{c.content}</span>
                                        <span className="text-md font-inter">{c.sContent}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>



            <div className=" mx-auto -mt-20 flex flex-row items-center justify-center gap-5">
                <div className="w-1/8 bg-black h-px"></div>
                <img src="/book.gif" className="w-12 h-12 cursor-pointer scale-100 active:scale-90 transition-all duration-100"></img>
                <div className="w-1/8 bg-black h-px"></div>
            </div>


            <div ref={textEditorRef} className="my-5"></div>

            <div className="my-32"></div>

            <div className="w-full h-full flex flex-row items-start justify-center px-32 gap-5 overflow-hidden">
                <div className="flex-1 w-full text-center group">
                    <p className="font-calsans text-4xl mb-2 text-gray-500 group-hover:text-black transition-colors duration-300">
                        Step 1
                    </p>
                    <p className={`${state.value == 'none' ? 'animate-bounce' : ''} font-calsans text-xl mb-5 text-gray-300 group-hover:text-black transition-colors duration-300`}>
                        Choose a mode first!
                    </p>
                    <Modes onModeSelect={send} currentMode={state.value} />
                </div>
                <div className="flex-4 group">
                    <div className="">
                        <span className="block w-fit mx-auto font-calsans text-4xl mb-2 text-gray-500 group-hover:text-black transition-colors duration-300">
                            Step 2
                        </span>
                        <p className="font-calsans block w-fit mx-auto text-xl mb-5 text-gray-300 group-hover:text-black transition-colors duration-300">
                            Type your story or dialogue prompt below.
                        </p>
                        <TextEditor primaryMode={state.value} />
                    </div>
                </div>
            </div>

            <div className="my-5"></div>
        </div>
    )
};