"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaLock, FaUnlock, FaGlobe } from "react-icons/fa";
import { PLATFORM_OPTIONS } from "@/lib/constants";

interface UnlockAction {
    platform: string;
    type: string;
    label: string;
    url: string;
}

export default function UnlockClient({ unlockActions, destinationUrl }: { unlockActions: UnlockAction[]; destinationUrl: string }) {
    const searchParams = useSearchParams();
    const linkId = searchParams?.get('id');
    const [completed, setCompleted] = useState<boolean[]>(unlockActions.map(() => false));
    const [unlocked, setUnlocked] = useState(false);
    const [notRobot, setNotRobot] = useState(false);
    const [tracking, setTracking] = useState(false);

    async function handleActionComplete(idx: number) {
        setCompleted(prev => prev.map((c, i) => (i === idx ? true : c)));

        // Track the action completion in the database
        try {
            await fetch('/api/link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    linkId,
                    actionIndex: idx,
                    completed: false, // Individual action completion
                }),
            });
        } catch (error) {
            console.error('Error tracking action:', error);
        }
    }

    async function handleUnlock() {
        if (!allComplete) return;

        setTracking(true);
        try {
            // Track the final unlock in the database
            await fetch('/api/link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    linkId,
                    actionIndex: -1, // Final unlock
                    completed: true,
                }),
            });

            setUnlocked(true);
        } catch (error) {
            console.error('Error tracking unlock:', error);
        } finally {
            setTracking(false);
        }
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
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => window.open(destinationUrl, '_blank')}
                    className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition text-center text-base sm:text-lg flex items-center justify-center gap-2"
                >
                    <FaUnlock /> Go to Unlocked Content
                </button>
                <div className="text-green-400 font-semibold flex items-center gap-2 text-sm sm:text-base">
                    <FaUnlock /> Unlocked!
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (allComplete) handleUnlock();
            }}
            className="w-full flex flex-col items-center gap-4 mt-4"
        >
            <div className="w-full flex flex-col gap-2">
                {unlockActions.map((action, idx) => {
                    const platform = PLATFORM_OPTIONS.find(p => p.value === action.platform);
                    const IconComponent = platform?.icon || FaGlobe;
                    return (
                        <a
                            href={action.url}
                            target="_blank"
                            key={idx}
                            rel="noopener noreferrer"
                            onClick={() => handleActionComplete(idx)}
                        >
                            <div className={`flex items-center gap-2 bg-[#181c1b] rounded-lg px-3 py-2 ${platform?.color || 'bg-gray-600'}`}>
                                <IconComponent className="text-base sm:text-lg" />
                                <span className="text-xs font-semibold text-gray-300">{action.label}</span>
                                {completed[idx] && <span className="text-green-400 text-xs ml-2">Completed</span>}
                            </div>
                        </a>
                    );
                })}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="not-robot"
                    checked={notRobot}
                    onChange={e => setNotRobot(e.target.checked)}
                    className="accent-green-500 w-4 h-4"
                />
                <label htmlFor="not-robot" className="text-gray-300 text-xs sm:text-sm select-none cursor-pointer">
                    I&apos;m not a robot
                </label>
            </div>
            <div className="w-full text-xs text-gray-400 text-right">{completedCount}/{unlockActions.length} actions completed</div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500" style={{ width: `${(completedCount / unlockActions.length) * 100}%` }} />
            </div>
            <button
                type="submit"
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gray-800 text-gray-400 font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 text-base sm:text-lg"
                disabled={!allComplete || tracking}
            >
                {tracking ? (
                    <>
                        <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <FaLock /> Unlock content
                    </>
                )}
            </button>
        </form>
    );
} 