import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/components/Providers";
import Link from "next/link";
import AuthNav from "@/app/components/AuthNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkUnlocker",
  description: "Unlock-to-access platform for sharing links with SEO and user profiles.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  type UserWithUsername = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
  const user = session?.user as UserWithUsername;
  const username = user?.username || user?.name || user?.email || "guest";
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Providers>
          <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 shadow-md fixed top-0 left-0 z-50 backdrop-blur-md">
            <Link href="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">LinkUnlocker</Link>
            <div className="flex gap-4 items-center">
              <Link href="/dashboard" className="hover:underline font-medium">Dashboard</Link>
              <Link href={`/public?username=${username}`} className="hover:underline font-medium">Profile</Link>
              <AuthNav />
            </div>
          </nav>
          <div className="min-h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
