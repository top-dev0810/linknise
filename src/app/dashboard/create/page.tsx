"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronLeft, FaRegImage, FaRegQuestionCircle, FaLock, FaPlus, FaTrash } from "react-icons/fa";

const PLATFORM_OPTIONS = [
    { value: "YouTube", label: "YouTube" },
    { value: "Instagram", label: "Instagram" },
    { value: "X", label: "X" },
    { value: "TikTok", label: "TikTok" },
    { value: "Facebook", label: "Facebook" },
    { value: "Discord", label: "Discord" },
    { value: "Threads", label: "Threads" },
    { value: "VK", label: "VK" },
    { value: "Pinterest", label: "Pinterest" },
    { value: "Telegram", label: "Telegram" },
    { value: "Spotify", label: "Spotify" },
    { value: "Soundcloud", label: "Soundcloud" },
    { value: "Twitch", label: "Twitch" },
    { value: "Reddit", label: "Reddit" },
    { value: "Beatstars", label: "Beatstars" },
    { value: "Roblox", label: "Roblox" },
    { value: "Other", label: "Other" },
];

const ACTION_TYPE_OPTIONS: {
    [key: string]: { value: string; label: string }[];
    YouTube: { value: string; label: string }[];
    Instagram: { value: string; label: string }[];
    X: { value: string; label: string }[];
    Roblox: { value: string; label: string }[];
    Other: { value: string; label: string }[];
} = {
    YouTube: [
        { value: "subscribe", label: "Subscribe to channel" },
        { value: "like", label: "Like video" },
        { value: "comment", label: "Comment on video" },
        { value: "share", label: "Share video" },
    ],
    Instagram: [
        { value: "follow", label: "Follow profile" },
        { value: "like", label: "Like post" },
        { value: "comment", label: "Comment on picture" },
        { value: "share", label: "Share post" },
    ],
    X: [
        { value: "follow", label: "Follow profile" },
        { value: "like", label: "Like post" },
        { value: "comment", label: "Comment on post" },
        { value: "repost", label: "Repost" },
    ],
    Roblox: [
        { value: "follow", label: "Follow user" },
        { value: "favorite", label: "Favorite game" },
        { value: "like", label: "Like game" },
        { value: "join", label: "Join group" },
    ],
    Other: [
        { value: "visit", label: "Visit Website" },
    ],
    // ... add more as needed
};

function getActionTypeOptions(platform: string): { value: string; label: string }[] {
    return ACTION_TYPE_OPTIONS[platform] || ACTION_TYPE_OPTIONS["Other"];
}

interface UnlockAction {
    platform: string;
    type: string;
    label: string;
    url: string;
}

export default function CreateLinkPage() {
    const [cover, setCover] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [notRobot, setNotRobot] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [unlockActions, setUnlockActions] = useState<UnlockAction[]>([
        { platform: "Other", type: "visit", label: "Visit Website", url: "" },
    ]);

    function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setCover(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragActive(true);
    }
    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragActive(false);
    }
    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setCover(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    }

    function handleActionChange(idx: number, field: keyof UnlockAction, value: string) {
        setUnlockActions(actions => {
            const updated = [...actions];
            updated[idx][field] = value;
            // If platform changes, reset type/label
            if (field === "platform") {
                const firstType = getActionTypeOptions(value)[0];
                updated[idx].type = firstType.value;
                updated[idx].label = firstType.label;
            }
            if (field === "type") {
                const platform = updated[idx].platform;
                const label = getActionTypeOptions(platform).find((opt: { value: string; label: string }) => opt.value === value)?.label || value;
                updated[idx].label = label;
            }
            return updated;
        });
    }
    function handleActionUrlChange(idx: number, value: string) {
        setUnlockActions(actions => {
            const updated = [...actions];
            updated[idx].url = value;
            return updated;
        });
    }
    function addUnlockAction() {
        setUnlockActions(actions => [
            ...actions,
            { platform: "Other", type: "visit", label: "Visit Website", url: "" },
        ]);
    }
    function removeUnlockAction(idx: number) {
        setUnlockActions(actions => actions.filter((_, i) => i !== idx));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("unlockActions", JSON.stringify(unlockActions));
            if (cover) formData.append("cover", cover);
            const res = await fetch("/api/links", {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            setLoading(false);
            if (res.ok) {
                router.push("/dashboard");
            } else {
                const data = await res.json();
                setError(data.message || "Failed to create link.");
            }
        } catch {
            setLoading(false);
            setError("Failed to create link.");
        }
    }

    // Placeholder for content policy progress
    const policyProgress = 1;
    const policyTotal = 5;

    return (
        <div className="pt-18 flex flex-col md:flex-row gap-10 max-w-6xl mx-auto py-12 px-2 md:px-0">
            {/* Left: Form */}
            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-[#232b45] flex flex-col gap-8 relative"
                style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)" }}
            >
                <button type="button" onClick={() => router.back()} className="absolute left-6 top-6 flex items-center gap-2 text-gray-400 hover:text-white text-base font-medium">
                    <FaChevronLeft /> Go back
                </button>
                <div className="flex items-center justify-between mb-2 mt-2">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Unlock Link</h2>
                    <button type="button" className="flex items-center gap-1 text-green-400 bg-[#232b45] px-4 py-1.5 rounded-full text-sm font-semibold shadow hover:bg-green-500/10 transition" title="Learn how unlock links work"><FaRegQuestionCircle /> How It Works</button>
                </div>
                <div className="mb-2">
                    <div className="text-xs text-gray-400 mb-1 font-medium">Content Policy Violations</div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500" style={{ width: `${(policyProgress / policyTotal) * 100}%` }} />
                    </div>
                    <div className="text-xs text-right text-gray-500 mt-1 font-mono">{policyProgress} of {policyTotal}</div>
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Add cover image</label>
                    <div
                        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center bg-[#141716] cursor-pointer transition-all duration-200 ${dragActive ? "border-green-400 bg-green-900/10" : "border-gray-600 hover:border-green-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {coverPreview ? (
                            <Image src={coverPreview} width={320} height={180} alt="Cover preview" className="rounded-lg w-full object-cover aspect-video mb-2 transition-all duration-300" />
                        ) : (
                            <FaRegImage className="text-4xl text-gray-500 mb-2" />
                        )}
                        <input type="file" accept="image/*" className="hidden" id="cover-upload" onChange={handleCoverChange} ref={fileInputRef} />
                        <label htmlFor="cover-upload" className="text-xs text-gray-400 cursor-pointer hover:text-green-400">16:9 ratio recommended (JPG, PNG) — Drag & drop or click to upload</label>
                    </div>
                </div>
                {/* Floating label inputs */}
                <div className="relative mb-2">
                    <input type="text" id="title" className="peer w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#101213] text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-transparent" placeholder="Enter a title *" value={title} onChange={e => setTitle(e.target.value)} required maxLength={80} />
                    <label htmlFor="title" className="absolute left-4 top-3 text-gray-400 text-sm pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-green-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400">Enter a title *</label>
                </div>
                <div className="relative mb-2">
                    <input type="text" id="desc" className="peer w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#101213] text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-transparent" placeholder="Enter a short-description" value={description} onChange={e => setDescription(e.target.value)} maxLength={200} />
                    <label htmlFor="desc" className="absolute left-4 top-3 text-gray-400 text-sm pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-green-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400">Enter a short-description</label>
                </div>
                {/* Unlock Actions */}
                <div className="mb-2">
                    <div className="font-semibold text-gray-300 mb-2 flex items-center gap-2">UNLOCK ACTIONS</div>
                    {unlockActions.map((action, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row items-center gap-2 mb-3 bg-[#181c1b] p-4 rounded-xl border border-gray-700 relative">
                            <select
                                className="px-3 py-2 rounded-lg bg-[#101213] border border-gray-700 text-white focus:ring-2 focus:ring-green-500"
                                value={action.platform}
                                onChange={e => handleActionChange(idx, "platform", e.target.value)}
                            >
                                {PLATFORM_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <select
                                className="px-3 py-2 rounded-lg bg-[#101213] border border-gray-700 text-white focus:ring-2 focus:ring-green-500"
                                value={action.type}
                                onChange={e => handleActionChange(idx, "type", e.target.value)}
                            >
                                {getActionTypeOptions(action.platform).map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <input
                                type="url"
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#101213] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter action URL *"
                                value={action.url}
                                onChange={e => handleActionUrlChange(idx, e.target.value)}
                                required
                            />
                            {unlockActions.length > 1 && (
                                <button type="button" className="text-red-400 hover:text-red-600 ml-2" onClick={() => removeUnlockAction(idx)} title="Remove Step"><FaTrash /></button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="flex items-center gap-2 text-green-400 hover:text-green-600 mt-2" onClick={addUnlockAction}><FaPlus /> Add Step</button>
                </div>
                {/* End Unlock Actions */}
                <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="not-robot" checked={notRobot} onChange={e => setNotRobot(e.target.checked)} className="accent-green-500 w-5 h-5 rounded border-2 border-gray-600 focus:ring-2 focus:ring-green-400 transition" />
                    <label htmlFor="not-robot" className="text-gray-300 text-base select-none cursor-pointer font-medium">I’m not a robot</label>
                </div>
                {error && <div className="text-red-500 font-medium mt-2">{error}</div>}
                <button type="submit" className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-bold shadow-lg hover:from-green-600 hover:to-purple-600 transition disabled:opacity-60 mt-2 text-lg tracking-wide" disabled={loading || !notRobot}>{loading ? "Creating..." : "Create Link"}</button>
            </form>
            {/* Right: Live Preview */}
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-[#232b45] flex flex-col gap-4 items-center transition-all duration-300" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)" }}>
                    <div className="w-full aspect-video bg-[#101213] rounded-lg flex items-center justify-center text-gray-600 mb-4 overflow-hidden">
                        {coverPreview ? <Image width={320} height={180} src={coverPreview} alt="Preview" className="w-full h-full object-cover transition-all duration-300" /> : <FaRegImage className="text-4xl" />}
                    </div>
                    <h2 className="text-2xl font-extrabold text-white text-center tracking-tight">{title || "Untitled"}</h2>
                    <p className="text-gray-400 text-center text-base">{description || "Press the unlock button to access the content"}</p>
                    <div className="w-full flex flex-col gap-2 mt-2">
                        {unlockActions.map((action, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-[#181c1b] rounded-lg px-3 py-2">
                                <span className="text-xs font-semibold text-gray-300">{action.label}</span>
                                <a href={action.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 underline break-all">{action.url}</a>
                            </div>
                        ))}
                    </div>
                    <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2 mt-2 cursor-not-allowed opacity-70" disabled><FaLock /> Unlock content</button>
                </div>
                <button className="mt-6 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">Preview Mode</button>
            </div>
        </div>
    );
} 