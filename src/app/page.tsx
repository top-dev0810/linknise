import { FaLock, FaChartLine, FaPalette, FaMoneyBillWave } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-6 mt-12">
        <div className="mb-2">
          <span className="text-3xl font-semibold text-white tracking-widest">NEXT.js</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-2">
          Unlock Content. Grow Faster.
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-4">
          Gate your content behind social actions and watch your audience grow. <br />
          Create, share, and manage unlockable links with real-time analytics and beautiful, branded pages.
        </p>
        <a href="/auth/signup" className="inline-block">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition">
            Get Started Free
          </button>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 w-full max-w-4xl">
        <div className="rounded-2xl bg-[#181f32] shadow-xl p-8 flex flex-col items-center text-center border border-[#232b45]">
          <FaLock className="text-3xl text-blue-400 mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Unlock Actions</h2>
          <p className="text-gray-400">Gate content behind social actions to grow your audience and engagement.</p>
        </div>
        <div className="rounded-2xl bg-[#181f32] shadow-xl p-8 flex flex-col items-center text-center border border-[#232b45]">
          <FaChartLine className="text-3xl text-purple-400 mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Real-time Analytics</h2>
          <p className="text-gray-400">Track engagement and growth with a powerful analytics dashboard.</p>
        </div>
        <div className="rounded-2xl bg-[#181f32] shadow-xl p-8 flex flex-col items-center text-center border border-[#232b45]">
          <FaPalette className="text-3xl text-pink-400 mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Customizable Pages</h2>
          <p className="text-gray-400">Create beautiful, branded unlock pages that match your style.</p>
        </div>
        <div className="rounded-2xl bg-[#181f32] shadow-xl p-8 flex flex-col items-center text-center border border-[#232b45]">
          <FaMoneyBillWave className="text-3xl text-green-400 mb-3" />
          <h2 className="text-xl font-bold text-white mb-1">Monetization</h2>
          <p className="text-gray-400">Integrate with platforms for additional revenue and growth.</p>
        </div>
      </div>
      <div className="fixed bottom-6 left-6">
        <div className="w-10 h-10 rounded-full bg-[#181f32] flex items-center justify-center border border-[#232b45] shadow">
          <span className="text-white text-lg font-bold">N</span>
        </div>
      </div>
    </main>
  );
}
