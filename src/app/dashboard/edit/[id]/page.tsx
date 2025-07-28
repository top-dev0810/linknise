"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaChevronLeft, FaRegImage, FaPlus, FaTrash } from "react-icons/fa";
import Image from "next/image";

interface UnlockAction {
    platform: string;
    type: string;
    label: string;
    url: string;
    validationType?: string;
}

interface Link {
    _id: string;
    destinationUrl: string;
    title: string;
    description: string;
    coverImage?: string;
    unlockActions: UnlockAction[];
}

export default function EditLinkPage() {
    const router = useRouter();
    const params = useParams();
    const linkId = params?.id as string;

    const [link, setLink] = useState<Link | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [destinationUrl, setDestinationUrl] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [unlockActions, setUnlockActions] = useState<UnlockAction[]>([]);

    const fetchLink = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/links/${linkId}`);
            if (res.ok) {
                const data = await res.json();
                setLink(data.link);
                setTitle(data.link.title);
                setDescription(data.link.description);
                setDestinationUrl(data.link.destinationUrl);
                setCoverPreview(data.link.coverImage || null);
                setUnlockActions(data.link.unlockActions || []);
            } else {
                console.error("Failed to fetch link data.");
            }
        } catch (err) {
            console.error("Error fetching link:", err);
        } finally {
            setLoading(false);
        }
    }, [linkId]);

    useEffect(() => {
        if (linkId) {
            fetchLink();
        }
    }, [linkId, fetchLink]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const addUnlockAction = () => {
        setUnlockActions([
            ...unlockActions,
            { platform: "", type: "", label: "", url: "" },
        ]);
    };

    const updateUnlockAction = (index: number, field: keyof UnlockAction, value: string) => {
        const newActions = [...unlockActions];
        newActions[index] = { ...newActions[index], [field]: value };
        setUnlockActions(newActions);
    };

    const removeUnlockAction = (index: number) => {
        setUnlockActions(unlockActions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("destinationUrl", destinationUrl);
        formData.append("unlockActions", JSON.stringify(unlockActions));
        if (coverImage) {
            formData.append("coverImage", coverImage);
        }

        try {
            const res = await fetch(`/api/links/${linkId}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                const data = await res.json();
                console.error(data.message || "Failed to update link.");
            }
        } catch (err) {
            console.error("Error updating link:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
            </div>
        );
    }

    if (!link && !loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Link not found</h2>
                    <p className="text-gray-400 mb-4">The link you&apos;re trying to edit doesn&apos;t exist.</p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                        Go back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-18 max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6">
            <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-[#232b45]">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium"
                    >
                        <FaChevronLeft /> Back
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Link</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="coverImage"
                        />
                        <label
                            htmlFor="coverImage"
                            className="block w-full aspect-video bg-[#232b45] rounded-lg cursor-pointer hover:bg-[#2a2d2c] transition"
                        >
                            {coverPreview ? (
                                <Image width={400} height={225} src={coverPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <FaRegImage className="text-4xl text-gray-500" />
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[#232b45] border border-[#232b45] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Description *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-4 py-3 bg-[#232b45] border border-[#232b45] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
                        />
                    </div>

                    {/* Destination URL */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Destination URL *</label>
                        <input
                            type="url"
                            value={destinationUrl}
                            onChange={(e) => setDestinationUrl(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[#232b45] border border-[#232b45] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                    </div>

                    {/* Unlock Actions */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-white">Unlock Actions</label>
                            <button
                                type="button"
                                onClick={addUnlockAction}
                                className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition"
                            >
                                <FaPlus /> Add Action
                            </button>
                        </div>

                        {unlockActions.map((action, index) => (
                            <div key={index} className="bg-[#232b45] rounded-lg p-4 mb-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Action {index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeUnlockAction(index)}
                                        className="text-red-400 hover:text-red-300 transition"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={action.platform}
                                        onChange={(e) => updateUnlockAction(index, "platform", e.target.value)}
                                        placeholder="Platform"
                                        className="px-3 py-2 bg-[#1a1d1c] border border-[#2a2d2c] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-400"
                                    />
                                    <input
                                        type="text"
                                        value={action.type}
                                        onChange={(e) => updateUnlockAction(index, "type", e.target.value)}
                                        placeholder="Action type"
                                        className="px-3 py-2 bg-[#1a1d1c] border border-[#2a2d2c] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-400"
                                    />
                                </div>

                                <input
                                    type="text"
                                    value={action.label}
                                    onChange={(e) => updateUnlockAction(index, "label", e.target.value)}
                                    placeholder="Action label"
                                    className="w-full px-3 py-2 bg-[#1a1d1c] border border-[#2a2d2c] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-400"
                                />

                                <input
                                    type="url"
                                    value={action.url}
                                    onChange={(e) => updateUnlockAction(index, "url", e.target.value)}
                                    placeholder="Action URL"
                                    className="w-full px-3 py-2 bg-[#1a1d1c] border border-[#2a2d2c] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-400"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition disabled:opacity-60"
                    >
                        {saving ? "Updating..." : "Update Link"}
                    </button>
                </form>
            </div>
        </div>
    );
} 