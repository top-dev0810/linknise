'use client';

import { useSearchParams } from "next/navigation";
import PublicProfilePage from "../components/PublicProfilePage";

export default function PublicPage() {
    const searchParams = useSearchParams();
    const username = searchParams?.get('username');

    if (!username) {
        return <div className="text-center mt-10 text-red-500">No username provided.</div>;
    }

    return <PublicProfilePage username={username} />;
} 