'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import UnlockClient from './UnlockClient';

interface UnlockAction {
    platform: string;
    type: string;
    label: string;
    url: string;
}

interface Creator {
    name?: string;
    email?: string;
}

interface LinkData {
    unlockActions: UnlockAction[];
    destinationUrl: string;
    title: string;
    description?: string;
    coverImage?: string;
    creator: string;
}

export default function UnlockPage() {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id');
    const [link, setLink] = useState<LinkData | null>(null);
    const [creator, setCreator] = useState<Creator | null>(null);
    const [creatorLinksCount, setCreatorLinksCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setCreatorLinksCount(data.creatorLinksCount);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching link:', err);
                setError(err.message || 'Failed to load link');
                setLoading(false);
            });
    }, [id]);

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
                <div className="flex items-center gap-3 mt-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                        {creator?.name?.[0] || creator?.email?.[0] || 'U'}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{creator?.name || 'Unnamed User'}</div>
                        <div className="text-xs text-gray-400">{creatorLinksCount} {creatorLinksCount === 1 ? 'post' : 'posts'}</div>
                    </div>
                </div>
                <UnlockClient unlockActions={link.unlockActions} destinationUrl={link.destinationUrl} />
            </div>
        </div>
    );
} 