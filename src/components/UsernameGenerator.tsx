"use client";

import { useEffect, useState } from "react";

export default function UsernameGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const generateUsername = async () => {
            try {
                setIsGenerating(true);
                const response = await fetch("/api/user/generate-username", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    // Reload the page to show the new username
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error generating username:", error);
            } finally {
                setIsGenerating(false);
            }
        };

        // Generate username on component mount
        generateUsername();
    }, []);

    if (isGenerating) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#181c1b] rounded-lg p-6 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                    <span className="text-white">Setting up your profile...</span>
                </div>
            </div>
        );
    }

    return null;
} 