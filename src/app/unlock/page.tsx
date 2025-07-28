'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { FaEye, FaUnlock } from 'react-icons/fa';
import UnlockClient from './UnlockClient';

interface UnlockAction {
    platform: string;
    type: string;
    label: string;
    url: string;
}


interface LinkData {
    unlockActions: UnlockAction[];
    destinationUrl: string;
    title: string;
    description?: string;
    coverImage?: string;
    creator: string;
    views?: number;
    unlocks?: number;
}

interface CreatorData {
    _id: string;
    name?: string;
    username?: string;
    email?: string;
    image?: string;
}

function UnlockPageContent() {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id');
    const [link, setLink] = useState<LinkData | null>(null);
    const [creator, setCreator] = useState<CreatorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewTracked, setViewTracked] = useState(false);

    const trackView = useCallback(async () => {
        if (!id || viewTracked) return;

        try {
            await fetch('/api/link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    linkId: id,
                    actionIndex: -2, // Special code for view tracking
                    completed: false,
                }),
            });
            setViewTracked(true);
        } catch (error) {
            console.error('Error tracking view:', error);
        }
    }, [id, viewTracked]);

    useEffect(() => {
        if (!id) {
            setError("No link ID provided.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`/api/link?id=${id}`)
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to fetch link');
                }
                return res.json();
            })
            .then(data => {
                setLink(data.link);
                setCreator(data.creator);
                setLoading(false);

                // Track the view after successful load
                if (!viewTracked) {
                    trackView();
                }
            })
            .catch((err) => {
                console.error('Error fetching link:', err);
                setError(err.message || 'Failed to load link');
                setLoading(false);
            });
    }, [id, viewTracked, trackView]);

    if (!id) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-12">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔗</div>
                    <h1 className="text-2xl font-bold text-white mb-2">No Link ID Provided</h1>
                    <p className="text-gray-400">Please provide a valid link ID to view this content.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-white mb-2">Loading...</h2>
                    <p className="text-gray-400">Fetching your unlock content</p>
                </div>
            </div>
        );
    }

    if (error || !link) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-12">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Link Not Found</h1>
                    <p className="text-gray-400 mb-4">{error || 'This link could not be found or may have been removed.'}</p>
                    <div className="text-sm text-gray-500">ID: {id}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-12">
            <div className="w-full max-w-xl mx-auto bg-[#181c1b] rounded-2xl shadow-xl p-8 border border-[#232b45] flex flex-col gap-6 items-center">
                {link.coverImage && (
                    <Image
                        src={link.coverImage}
                        alt="Cover"
                        width={640}
                        height={360}
                        className="rounded-lg w-full object-cover aspect-video"
                    />
                )}
                <h1 className="text-3xl font-bold text-white text-center">{link.title}</h1>
                {link.description && (
                    <p className="text-gray-400 text-center">{link.description}</p>
                )}

                {/* Views and Creator Info */}
                <div className="w-full flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                            <FaEye className="text-gray-400" />
                            {link.views || 0} views
                        </span>
                        {link.unlocks && (
                            <span className="flex items-center gap-1">
                                <FaUnlock className="text-gray-400" />
                                {link.unlocks} unlocks
                            </span>
                        )}
                    </div>
                    {creator?.username && (
                        <a
                            href={`/public?username=${creator.username}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            @{creator.username}
                        </a>
                    )}
                </div>

                <UnlockClient unlockActions={link.unlockActions} destinationUrl={link.destinationUrl} />
            </div>
        </div>
    );
}

export default function UnlockPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-white mb-2">Loading...</h2>
                    <p className="text-gray-400">Preparing your unlock content</p>
                </div>
            </div>
        }>
            <UnlockPageContent />
        </Suspense>
    );
} 