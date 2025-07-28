"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronLeft, FaUser, FaEnvelope, FaEdit, FaSave } from "react-icons/fa";

interface ProfileData {
    name?: string;
    email?: string;
    username?: string;
    bio?: string;
    image?: string;
}

interface ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
    bio?: string;
}

export default function ProfileEditPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<ProfileData>({
        name: "",
        email: "",
        username: "",
        bio: "",
        image: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [newImage, setNewImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        if (session?.user) {
            const user = session.user as ExtendedUser;
            setProfile({
                name: user.name || "",
                email: user.email || "",
                username: user.username || "",
                bio: user.bio || "",
                image: user.image || "",
            });
            setLoading(false);
        }
    }, [session]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("name", profile.name || "");
            formData.append("username", profile.username || "");
            formData.append("bio", profile.bio || "");
            if (newImage) {
                formData.append("image", newImage);
            }

            const response = await fetch("/api/profile/edit", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess("Profile updated successfully!");

                // Update the session with new data
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: profile.name,
                        image: data.image || session?.user?.image,
                    },
                });

                // Redirect to profile page after a short delay
                setTimeout(() => {
                    router.push("/profile");
                }, 1500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
            </div>
        );
    }

    return (
        <div className="pt-18 min-h-screen bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <FaChevronLeft /> Back
                    </button>
                    <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                </div>

                {/* Profile Form */}
                <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl border border-[#232b45] p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#232b45] flex items-center justify-center">
                                    {(imagePreview || profile.image) ? (
                                        <Image
                                            src={imagePreview || profile.image || ""}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FaUser className="text-3xl text-gray-500" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition"
                                >
                                    <FaEdit className="text-sm" />
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-400 text-center">
                                Click the edit button to change your profile picture
                            </p>
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400">
                                {success}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#101213] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter your display name"
                                maxLength={50}
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-gray-400">@</span>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-700 bg-[#101213] text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="username"
                                    maxLength={30}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Only letters, numbers, and underscores allowed
                            </p>
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-700 bg-[#101213] text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Email cannot be changed for security reasons
                            </p>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-[#101213] text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                placeholder="Tell us about yourself..."
                                rows={4}
                                maxLength={200}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {profile.bio?.length || 0}/200 characters
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave /> Save Changes
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/profile")}
                                className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 