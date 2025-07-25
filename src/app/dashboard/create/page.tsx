"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronLeft, FaRegImage, FaRegQuestionCircle, FaLock } from "react-icons/fa";

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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("url", url);
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
                <div className="relative mb-2">
                    <input type="url" id="url" className="peer w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#101213] text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-transparent" placeholder="Enter a destination URL *" value={url} onChange={e => setUrl(e.target.value)} required />
                    <label htmlFor="url" className="absolute left-4 top-3 text-gray-400 text-sm pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-green-400 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400">Enter a destination URL *</label>
                </div>
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
                    <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold flex items-center justify-center gap-2 mt-2 cursor-not-allowed opacity-70" disabled><FaLock /> Unlock content</button>
                </div>
                <button className="mt-6 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">Preview Mode</button>
            </div>
        </div>
    );
} 