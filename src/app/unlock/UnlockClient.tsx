"use client";
import { useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";

export default function UnlockClient({ url }: { url: string }) {
    const [unlocked, setUnlocked] = useState(false);
    const [notRobot, setNotRobot] = useState(false);

    if (unlocked) {
        return (
            <div className="w-full flex flex-col items-center gap-4 mt-4">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-3 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition text-center text-lg flex items-center justify-center gap-2"
                >
                    <FaUnlock /> Go to Unlocked Content
                </a>
                <div className="text-green-400 font-semibold flex items-center gap-2">
                    <FaUnlock /> Unlocked!
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (notRobot) setUnlocked(true);
            }}
            className="w-full flex flex-col items-center gap-4 mt-4"
        >
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="not-robot"
                    checked={notRobot}
                    onChange={e => setNotRobot(e.target.checked)}
                    className="accent-green-500 w-4 h-4"
                />
                <label htmlFor="not-robot" className="text-gray-300 text-sm select-none cursor-pointer">
                    I’m not a robot
                </label>
            </div>
            <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-gray-800 text-gray-400 font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                disabled={!notRobot}
            >
                <FaLock /> Unlock content
            </button>
        </form>
    );
} 