'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'gospel_ai_history';

export default function History({ items: initialItems = [] }) {
    const [items, setItems] = useState(initialItems);
    const [selected, setSelected] = useState(null);

    const load = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            setItems(parsed);
        } catch (e) {
            console.error('Failed to load history', e);
            setItems([]);
        }
    };

    useEffect(() => {
        load();
        const handler = () => load();
        window.addEventListener('gospel_history_updated', handler);
        // also listen to storage events from other tabs
        const storageHandler = (ev) => {
            if (ev.key === STORAGE_KEY) load();
        };
        window.addEventListener('storage', storageHandler);
        return () => {
            window.removeEventListener('gospel_history_updated', handler);
            window.removeEventListener('storage', storageHandler);
        };
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleDelete = (id) => {
        const newItems = items.filter((i) => i.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        setItems(newItems);
        setSelected(null);
        window.dispatchEvent(new Event('gospel_history_updated'));
    };

    const handleClearAll = () => {
        if (!window.confirm('Clear all history?')) return;
        localStorage.removeItem(STORAGE_KEY);
        setItems([]);
        setSelected(null);
        window.dispatchEvent(new Event('gospel_history_updated'));
    };

    return (
        <div className="p-2 h-full w-full flex flex-col gap-2">
            <div className="flex flex-col gap-0 justify-center items-center mb-2">
                <span className="font-calsans text-xl block w-fit mx-auto">HISTORY</span>
                {items.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-xs font-calsans text-red-500 hover:text-red-700 underline"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="overflow-y-auto flex flex-col gap-2 flex-1">
                {items.length === 0 ? (
                    <div className="text-center text-gray-400 font-inter text-sm mt-8">
                        No history yet.<br />Saved stories will appear here.
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelected(item)}
                            className="w-full border border-black rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-150 active:scale-95"
                        >
                            <p className="font-inter text-sm font-semibold truncate">
                                {item.preview}
                            </p>
                            <span className="font-inter text-xs text-gray-500">
                                {formatDate(item.timestamp)}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {selected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <div className="flex flex-col">
                                <span className="font-calsans text-lg">SAVED TEXT</span>
                                <span className="font-inter text-xs text-gray-500">
                                    {formatDate(selected.timestamp)}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(selected.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-inter text-sm hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="px-4 py-2 bg-black text-white rounded-lg font-inter text-sm hover:bg-gray-800 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <p className="font-inter text-base whitespace-pre-wrap leading-relaxed">
                                {selected.text}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}