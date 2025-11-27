'use client';

import { useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from 'prosemirror-schema-basic';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { editorMachine } from '../lib/editorMachine';
import History from './History';


export default function TextEditor({ primaryMode }) {
    const editorRef = useRef(null);
    const viewRef = useRef(null);
    const [state, send] = useMachine(editorMachine);
    const [savedItems, setSavedItems] = useState([]);

    const STORAGE_KEY = 'gospel_ai_history';

    const loadSaved = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            setSavedItems(parsed);
        } catch (e) {
            console.error('Failed to load history from localStorage', e);
            setSavedItems([]);
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        loadSaved();
        const handler = () => loadSaved();
        window.addEventListener('gospel_history_updated', handler);
        return () => window.removeEventListener('gospel_history_updated', handler);
    }, []);

    useEffect(() => {
        if (!editorRef.current) return;

        const editorState = EditorState.create({
            schema,
            plugins: [
                history(),
                keymap({ 'Mod-z': undo, 'Mod-y': redo }),
                keymap(baseKeymap),
            ],
        });

        const view = new EditorView(editorRef.current, {
            state: editorState,
            dispatchTransaction(transaction) {
                const newState = view.state.apply(transaction);
                view.updateState(newState);
                
                let content = '';
                newState.doc.descendants((node) => {
                    if (node.isText) {
                        content += node.text;
                    } else if (node.isBlock && content.length > 0) {
                        content += '\n';
                    }
                });
                content = content.trim();
                
                if(content === 'undefined'){
                    content = '';
                }

                if (content.length > 0) {
                    send({ type: 'TYPE', content });
                } else {
                    send({ type: 'CLEAR' });
                }
            }
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        };
    }, [send]);

    useEffect(() => {
        if (!viewRef.current || primaryMode !== 'random') return;
        
        const currentContent = getEditorContent();
        if (currentContent === '') {
            const templateText = 'Genre: [...add your intended genre here, for ex: fiction]  \nMood: [...add moods that you want your gospel to reflect, for ex: comedy]';
            const { state, dispatch } = viewRef.current;
            const tr = state.tr.insertText(templateText, 0);
            dispatch(tr);
        }
    }, [primaryMode]);

    const getEditorContent = () => {
        if (!viewRef.current) return '';
        const { state } = viewRef.current;
        let text = '';
        state.doc.descendants((node) => {
            if (node.isText) {
                text += node.text;
            } else if (node.isBlock && text.length > 0) {
                text += '\n';
            }
        });
        return text.trim();
    };

    const insertTextAtEnd = (text) => {
        if (!viewRef.current) return;
        const { state, dispatch } = viewRef.current;
        const tr = state.tr.insertText(text, state.doc.content.size);
        dispatch(tr);
    };

    const handleContinueWriting = async () => {
        if (!primaryMode || primaryMode === 'none') {
            alert('Please select a mode first!');
            return;
        }

        const content = getEditorContent();

        if (!content.trim()) {
            return;
        }

        send({ type: 'SUBMIT' });

        // Route to the correct API based on primaryMode
        let apiRoute = '/api/story';
        if (primaryMode === 'dialogue') {
            apiRoute = '/api/dialogue';
        } else if (primaryMode === 'random') {
            apiRoute = '/api/random';
        }

        try {
            const response = await fetch(apiRoute, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 429 rate limit error specifically
                const errorType = response.status === 429 ? 'rate-limit' : 'general';
                send({ type: 'ERROR', errorType });
                return; // Exit early on error
            }
            
            // Insert AI response into editor
            insertTextAtEnd(' ' + data.response);
            send({ type: 'SUCCESS' });
        } catch (error) {
            console.error('Error:', error);
            // Error state is already set via send({ type: 'ERROR' })
        }
    };

    const handleReset = () => {
        if (!viewRef.current) return;
        const { state: editorState, dispatch } = viewRef.current;
        const tr = editorState.tr.delete(0, editorState.doc.content.size);
        dispatch(tr);
        send({ type: 'CLEAR' });
    };

    const handleSaveToHistory = () => {
        const content = getEditorContent();
        if (!content.trim()) {
            alert('Nothing to save!');
            return;
        }

        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const items = raw ? JSON.parse(raw) : [];
            const trimmed = content.trim();
            const newItem = {
                id: Date.now().toString(),
                text: trimmed,
                timestamp: new Date().toISOString(),
                preview: trimmed.length > 50 ? `${trimmed.substring(0,50)}...` : trimmed
            };
            const newItems = [newItem, ...items];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            // notify History component(s)
            window.dispatchEvent(new Event('gospel_history_updated'));
            alert('Saved to history!');
        } catch (e) {
            console.error('Failed to save history', e);
            alert('Failed to save history');
        }
    };

    const isDisabled = !primaryMode || primaryMode === 'none';
    const isLoading = state.matches('loading');
    const isError = state.matches('error');
    const isIdle = state.matches('idle');

    return (
        <div className="rounded-3xl bg-black w-full h-screen mx-auto grid grid-cols-4 grid-rows-4 gap-2 p-2">
            <div id='menu-list' className={`col-span-3 row-span-full bg-white rounded-2xl overflow-y-auto font-inter relative ${isDisabled ? 'opacity-80 pointer-events-none' : ''}`}>
                <div className="h-full w-full" ref={editorRef} />
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl">
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black mb-4"></div>
                            <span className="text-xl font-inter font-bold">THINKING...</span>
                        </div>
                    </div>
                )}
                {isError && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl p-8">
                        <div className="flex flex-col items-center text-center max-w-md">
                                <>
                                    <p className="text-2xl font-inter font-bold text-red-600 mb-2"> :( </p>
                                    <p className="text-2xl font-inter font-extrabold text-black mb-4">Retry again after some time...</p>
                                </>
                            <button
                                onClick={() => send({ type: 'DISMISS' })}
                                className="mt-6 px-6 py-2 bg-white border border-black text-black rounded-lg font-calsans hover:bg-black hover:text-white transition-colors duration-150"
                            >
                                DISMISS
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className={`col-span-1 row-span-1 bg-white rounded-2xl ${isDisabled ? 'opacity-80' : ''}`}>
                <div className="w-full h-full flex flex-col justify-center items-center p-2 gap-2">
                    <button
                        onClick={handleContinueWriting}
                        disabled={isLoading || isDisabled || isIdle || isError}
                        className='font-calsans grow border border-black w-full rounded-xl p-2 hover:bg-black hover:text-white transition-all duration-150 ease-linear scale-100 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isLoading ? (
                            <div className='flex flex-col items-center justify-center'>
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
                                <span>THINKING...</span>
                            </div>
                        ) : isIdle ? (<p>PLEASE WRITE</p>) : (<p>CONTINUE WRITING...</p>)}
                    </button>

                    <button
                        onClick={handleSaveToHistory}
                        disabled={isLoading || isDisabled || isIdle || isError}
                        className='font-calsans border border-black w-full rounded-xl p-2 hover:bg-green-500 hover:text-white transition-all duration-150 ease-linear scale-100 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        SAVE
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={isLoading || isDisabled || isError}
                        className='font-calsans border border-black w-full rounded-xl p-2 hover:bg-red-500 hover:text-white transition-all duration-150 ease-linear scale-100 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        RESET
                    </button>
                </div>
            </div>
            <div className={`col-span-1 row-span-3 bg-white rounded-2xl ${isDisabled ? 'opacity-80' : ''}`}>
                <History items={savedItems} />
            </div>

            <style jsx global>{`
                .ProseMirror {
                    min-height: 100%;
                    width: 100%;
                    outline: none;
                    padding: 16px;
                    font-size: 32px;
                    line-height: 1.5;
                    cursor: text;
                    box-sizing: border-box;
                }

                .ProseMirror p {
                    margin: 0 0 1em 0;
                }
            `}</style>
        </div>
    );
}
