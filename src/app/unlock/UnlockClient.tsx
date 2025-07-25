"use client";
import { useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";

interface UnlockAction {
    platform: string;
    type: string;
    label: string;
    url: string;
}

export default function UnlockClient({ unlockActions }: { unlockActions: UnlockAction[] }) {
    const [completed, setCompleted] = useState<boolean[]>(unlockActions.map(() => false));
    const [unlocked, setUnlocked] = useState(false);
    const [notRobot, setNotRobot] = useState(false);

    function handleActionComplete(idx: number) {
        setCompleted(prev => prev.map((c, i) => (i === idx ? true : c)));
    }

    const allComplete = completed.every(Boolean) && notRobot;
    const completedCount = completed.filter(Boolean).length;

    if (unlocked) {
        return (
            <div className="w-full flex flex-col items-center gap-4 mt-4">
                <div className="w-full flex flex-col gap-2">
                    {unlockActions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#181c1b] rounded-lg px-3 py-2">
                            <span className="text-xs font-semibold text-gray-300">{action.label}</span>
                            <a href={action.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 underline break-all">{action.url}</a>
                        </div>
                    ))}
                </div>
                <a
                    href={unlockActions[0]?.url || '#'}
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
                if (allComplete) setUnlocked(true);
            }}
            className="w-full flex flex-col items-center gap-4 mt-4"
        >
            <div className="w-full flex flex-col gap-2">
                {unlockActions.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#181c1b] rounded-lg px-3 py-2">
                        <span className="text-xs font-semibold text-gray-300">{action.label}</span>
                        <a
                            href={action.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 underline break-all"
                            onClick={() => handleActionComplete(idx)}
                        >
                            {action.url}
                        </a>
                        {completed[idx] && <span className="text-green-400 text-xs ml-2">Completed</span>}
                    </div>
                ))}
            </div>
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
            <div className="w-full text-xs text-gray-400 text-right">{completedCount}/{unlockActions.length} actions completed</div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500" style={{ width: `${(completedCount / unlockActions.length) * 100}%` }} />
            </div>
            <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-gray-800 text-gray-400 font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                disabled={!allComplete}
            >
                <FaLock /> Unlock content
            </button>
        </form>
    );
} 