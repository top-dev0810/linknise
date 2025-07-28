'use client';

import { useSearchParams } from "next/navigation";
import PublicProfilePage from "../components/PublicProfilePage";
import { Suspense } from "react";

function PublicPageContent() {
    const searchParams = useSearchParams();
    const username = searchParams?.get('username');

    if (!username) {
        return <div className="text-center mt-10 text-red-500">No username provided.</div>;
    }

    return <PublicProfilePage username={username} />;
}

export default function PublicPage() {
    return (
        <Suspense fallback={<div className="text-center mt-10 text-gray-400">Loading...</div>}>
            <PublicPageContent />
        </Suspense>
    );
} 