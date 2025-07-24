"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLinkPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await fetch("/api/links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, url }),
        });
        setLoading(false);
        if (res.ok) {
            router.push("/dashboard");
        } else {
            const data = await res.json();
            setError(data.message || "Failed to create link.");
        }
    }

    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Create New Unlock Link</h1>
            <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-8 flex flex-col gap-6 border border-[#232b45]">
                <div>
                    <label className="block font-semibold mb-1">Title</label>
                    <input type="text" className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-800" value={title} onChange={e => setTitle(e.target.value)} required maxLength={80} />
                </div>
                <div>
                    <label className="block font-semibold mb-1">Description</label>
                    <textarea className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-800" value={description} onChange={e => setDescription(e.target.value)} required maxLength={200} rows={3} />
                </div>
                <div>
                    <label className="block font-semibold mb-1">Unlock Link</label>
                    <input type="url" className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-800" value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://..." />
                </div>
                {error && <div className="text-red-500 font-medium">{error}</div>}
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60" disabled={loading}>{loading ? "Creating..." : "Create Link"}</button>
            </form>
        </div>
    );
} 