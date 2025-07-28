import { FaLock, FaChartLine, FaPalette, FaMoneyBillWave } from "react-icons/fa";
import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6 mt-8 sm:mt-12">
        <div className="mb-2">
          <span className="text-2xl sm:text-3xl font-semibold text-white tracking-widest">NEXT.js</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-2 leading-tight">
          Unlock Content. Grow Faster.
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 sm:mb-6 leading-relaxed">
          Gate your content behind social actions and watch your audience grow. <br className="hidden sm:block" />
          Create, share, and manage unlockable links with real-time analytics and beautiful, branded pages.
        </p>
        <Link href="/auth/signup" className="inline-block">
          <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-base sm:text-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition">
            Get Started Free
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16 w-full max-w-4xl">
        <div className="rounded-2xl bg-[#181f32] shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-[#232b45]">
          <FaLock className="text-2xl sm:text-3xl text-blue-400 mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Unlock Actions</h2>
          <p className="text-gray-400 text-sm sm:text-base">Gate content behind social actions to grow your audience and engagement.</p>
        </div>
        <div className="rounded-2xl bg-[#181f32] shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-[#232b45]">
          <FaChartLine className="text-2xl sm:text-3xl text-purple-400 mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Real-time Analytics</h2>
          <p className="text-gray-400 text-sm sm:text-base">Track engagement and growth with a powerful analytics dashboard.</p>
        </div>
        <div className="rounded-2xl bg-[#181f32] shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-[#232b45]">
          <FaPalette className="text-2xl sm:text-3xl text-pink-400 mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Customizable Pages</h2>
          <p className="text-gray-400 text-sm sm:text-base">Create beautiful, branded unlock pages that match your style.</p>
        </div>
        <div className="rounded-2xl bg-[#181f32] shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-[#232b45]">
          <FaMoneyBillWave className="text-2xl sm:text-3xl text-green-400 mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Monetization</h2>
          <p className="text-gray-400 text-sm sm:text-base">Integrate with platforms for additional revenue and growth.</p>
        </div>
      </div>
    </main>
  );
}